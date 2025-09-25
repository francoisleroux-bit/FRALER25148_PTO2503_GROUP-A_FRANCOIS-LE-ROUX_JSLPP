export const tasksById = {};
const prioRank = { high: 0, medium: 1, low: 2 };

const headerTodo = document.getElementById("toDoText");
const headerDoing = document.getElementById("doingText");
const headerDone = document.getElementById("doneText");
const statusEl = document.getElementById("fetch-status");

export function setStatusMessage(msg = "", isError = false) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.classList.toggle("is-error", !!isError);
  statusEl.classList.toggle("is-loading", !!msg && !isError);
}

export function createTaskElement(task, openModal) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "task-div";
  el.textContent = task.title;
  el.dataset.taskId = task.id;
  el.dataset.status = task.status;
  if (task.priority) el.dataset.priority = String(task.priority).toLowerCase();
  el.addEventListener("click", () => openModal(task));
  return el;
}

function containerFor(status) {
  return document.querySelector(
    `.column-div[data-status="${status}"] .tasks-container`
  );
}
function clearContainers() {
  document
    .querySelectorAll(".tasks-container")
    .forEach((c) => (c.innerHTML = ""));
}

export function renderTasks(list, openModal) {
  clearContainers();
  for (const k in tasksById) delete tasksById[k];

  ["todo", "doing", "done"].forEach((status) => {
    const container = containerFor(status);
    if (!container) return;

    const group = list.filter((t) => t.status === status);
    group.sort((a, b) => {
      const ra = prioRank[(a.priority || "medium").toLowerCase()] ?? 1;
      const rb = prioRank[(b.priority || "medium").toLowerCase()] ?? 1;
      return ra - rb || +a.id - +b.id;
    });

    group.forEach((task) => {
      tasksById[task.id] = task;
      container.appendChild(createTaskElement(task, openModal));
    });
  });

  headerTodo.textContent = `TODO (${
    document.querySelectorAll('[data-status="todo"] .task-div').length
  })`;
  headerDoing.textContent = `DOING (${
    document.querySelectorAll('[data-status="doing"] .task-div').length
  })`;
  headerDone.textContent = `DONE (${
    document.querySelectorAll('[data-status="done"] .task-div').length
  })`;
}
