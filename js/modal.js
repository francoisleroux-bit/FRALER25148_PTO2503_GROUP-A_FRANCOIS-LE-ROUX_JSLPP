import { tasksById } from "./ui.js";
import { saveTasksToStorage, nextId } from "./storage.js";

const modalEl = document.getElementById("task-modal");
const formEl = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-desc");
const statusSelect = document.getElementById("task-status");
const prioritySelect = document.getElementById("task-priority");
const closeBtn = document.getElementById("close-modal-btn");
const errorTip = document.getElementById("form-error-tip");
const modalTitleEl = document.getElementById("modal-title");
const submitBtn = document.getElementById("submit-task-btn");
const deleteBtn = document.getElementById("delete-task-btn");

let activeEditingId = null;

function showErrorTip(anchorEl, message) {
  errorTip.textContent = `❗ ${message}`;
  errorTip.hidden = false;
  const a = anchorEl.getBoundingClientRect();
  const f = formEl.getBoundingClientRect();
  errorTip.style.left = Math.max(12, a.left - f.left + 8) + "px";
  errorTip.style.top = Math.max(8, a.top - f.top - 10) + "px";
}
function hideErrorTip() {
  errorTip.hidden = true;
}

export function openTaskModal(task, tasks, render) {
  activeEditingId = task.id;
  titleInput.value = task.title || "";
  descInput.value = task.description || "";
  statusSelect.value = task.status || "todo";
  prioritySelect.value = (task.priority || "medium").toLowerCase();

  modalTitleEl.textContent = "Task";
  submitBtn.textContent = "Save Changes";
  deleteBtn.hidden = false;

  hideErrorTip();
  modalEl.showModal();
  setTimeout(() => titleInput.focus(), 0);

  deleteBtn.onclick = () => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    const idx = tasks.findIndex((t) => +t.id === +activeEditingId);
    if (idx !== -1) tasks.splice(idx, 1);
    saveTasksToStorage(tasks);
    render(tasks, openTaskModal);
    closeModal();
  };
}

export function openCreateModal() {
  activeEditingId = null;
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "todo";
  prioritySelect.value = "medium";

  modalTitleEl.textContent = "Add New Task";
  submitBtn.textContent = "Create Task";
  deleteBtn.hidden = true;

  hideErrorTip();
  modalEl.showModal();
  setTimeout(() => titleInput.focus(), 0);
}

export function closeModal() {
  if (modalEl.open) modalEl.close();
  hideErrorTip();
}

export function setupModalHandlers(tasks, render) {
  closeBtn.addEventListener("click", closeModal);

  modalEl.addEventListener("click", (e) => {
    const rect = modalEl.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inside) closeModal();
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const status = statusSelect.value.toLowerCase();
    const priority = prioritySelect.value.toLowerCase();

    if (!title) return showErrorTip(titleInput, "Please fill out this field.");

    if (activeEditingId != null) {
      const t = tasksById[activeEditingId];
      if (t) {
        t.title = title;
        t.description = description;
        t.status = status;
        t.priority = priority;
      }
    } else {
      tasks.push({
        id: nextId(tasks),
        title,
        description,
        status,
        priority,
        board: "Launch Career",
      });
    }

    saveTasksToStorage(tasks);
    render(tasks, openTaskModal);
    closeModal();
  });

  titleInput.addEventListener("input", hideErrorTip);
  descInput.addEventListener("input", hideErrorTip);
}
