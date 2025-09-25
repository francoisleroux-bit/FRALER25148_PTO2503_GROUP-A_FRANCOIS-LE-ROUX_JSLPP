import { initialTasks as seedTasks } from "./initialData.js";

/** -----------------------------------------
 * Local state & constants
 * ----------------------------------------*/
const PERSIST = true;
const STORAGE_KEY = "kanban.tasks";
const BOARD_NAME = "Launch Career";

/** @typedef {{id:number,title:string,description:string,status:'todo'|'doing'|'done',board?:string}} Task */
let tasks = [];
const tasksById = {};
let activeEditingId = null;

/** -----------------------------------------
 * DOM
 * ----------------------------------------*/
const headerTodo = document.getElementById("toDoText");
const headerDoing = document.getElementById("doingText");
const headerDone = document.getElementById("doneText");

const modalEl = document.getElementById("task-modal");
const formEl = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-desc");
const statusSelect = document.getElementById("task-status");
const closeBtn = document.getElementById("close-modal-btn");
const errorTip = document.getElementById("form-error-tip");

const addBtn = document.getElementById("open-create-modal");
const modalTitleEl = document.getElementById("modal-title");
const submitBtn = document.getElementById("submit-task-btn");

/** -----------------------------------------
 * Storage (read from localStorage; seed if empty)
 * ----------------------------------------*/
function loadTasksFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    } catch {}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTasks));
  return seedTasks.map((t) => ({ ...t }));
}
function saveTasksToStorage() {
  if (!PERSIST) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function nextId() {
  let max = 0;
  for (let i = 0; i < tasks.length; i++)
    if (tasks[i].id > max) max = tasks[i].id;
  return max + 1;
}

/** -----------------------------------------
 * Rendering
 * ----------------------------------------*/
function createTaskElement(task) {
  const el = document.createElement("div");
  el.className = "task-div";
  el.textContent = task.title;
  el.dataset.taskId = task.id;
  el.addEventListener("click", () => openTaskModal(task));
  return el;
}
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}
function clearExistingTasks() {
  document
    .querySelectorAll(".tasks-container")
    .forEach((c) => (c.innerHTML = ""));
}
function renderTasks(list) {
  clearExistingTasks();
  for (const k in tasksById) delete tasksById[k];
  list.forEach((task) => {
    tasksById[task.id] = task;
    const container = getTaskContainerByStatus(task.status);
    if (container) container.appendChild(createTaskElement(task));
  });
  refreshCounts();
}
function refreshCounts() {
  const todo =
    getTaskContainerByStatus("todo")?.getElementsByClassName("task-div")
      .length || 0;
  const doing =
    getTaskContainerByStatus("doing")?.getElementsByClassName("task-div")
      .length || 0;
  const done =
    getTaskContainerByStatus("done")?.getElementsByClassName("task-div")
      .length || 0;
  if (headerTodo) headerTodo.textContent = `TODO (${todo})`;
  if (headerDoing) headerDoing.textContent = `DOING (${doing})`;
  if (headerDone) headerDone.textContent = `DONE (${done})`;
}

/** -----------------------------------------
 * Validation bubble (custom)
 * ----------------------------------------*/
function showErrorTip(anchorEl, message) {
  if (!errorTip || !formEl) return;
  errorTip.textContent = `❗ ${message}`;
  const a = anchorEl.getBoundingClientRect();
  const f = formEl.getBoundingClientRect();
  errorTip.style.left = Math.max(12, a.left - f.left + 8) + "px";
  errorTip.style.top = Math.max(8, a.top - f.top - 10) + "px";
  errorTip.hidden = false;
}
function hideErrorTip() {
  if (errorTip) errorTip.hidden = true;
}

/** -----------------------------------------
 * Modal
 * ----------------------------------------*/
function openTaskModal(task) {
  activeEditingId = task.id;
  titleInput.value = task.title || "";
  descInput.value = task.description || "";
  statusSelect.value = task.status || "todo";
  if (modalTitleEl) modalTitleEl.textContent = "Task";
  if (submitBtn) submitBtn.textContent = "Create Task";
  hideErrorTip();
  modalEl.showModal();
  setTimeout(() => titleInput?.focus(), 0);
}
function openCreateModal() {
  activeEditingId = null;
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "todo";
  if (modalTitleEl) modalTitleEl.textContent = "Add New Task";
  if (submitBtn) submitBtn.textContent = "Create Task";
  hideErrorTip();
  modalEl.showModal();
  setTimeout(() => titleInput?.focus(), 0);
}
function closeModal() {
  if (modalEl?.open) modalEl.close();
  hideErrorTip();
}
function setupModalCloseHandler() {
  closeBtn?.addEventListener("click", closeModal);
  modalEl?.addEventListener("click", (e) => {
    const rect = modalEl.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inside) closeModal();
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = (titleInput.value || "").trim();
  const description = (descInput.value || "").trim();
  const status = /** @type {'todo'|'doing'|'done'} */ (statusSelect.value);

  if (!title) return showErrorTip(titleInput, "Please fill out this field.");
  if (!description)
    return showErrorTip(descInput, "Please fill out this field.");
  hideErrorTip();

  if (activeEditingId != null) {
    const t = tasksById[activeEditingId];
    if (t) {
      t.title = title;
      t.description = description;
      t.status = status;
    }
  } else {
    tasks.push({ id: nextId(), title, description, status, board: BOARD_NAME });
  }

  saveTasksToStorage();
  renderTasks(tasks);
  closeModal();
}

/** -----------------------------------------
 * Init
 * ----------------------------------------*/
function initTaskBoard() {
  tasks = loadTasksFromStorage().filter(
    (t) => !t.board || t.board === BOARD_NAME
  );
  renderTasks(tasks);
  setupModalCloseHandler();
  formEl?.addEventListener("submit", handleFormSubmit);
  addBtn?.addEventListener("click", openCreateModal);
  titleInput?.addEventListener("input", hideErrorTip);
  descInput?.addEventListener("input", hideErrorTip);
}
document.addEventListener("DOMContentLoaded", initTaskBoard);
