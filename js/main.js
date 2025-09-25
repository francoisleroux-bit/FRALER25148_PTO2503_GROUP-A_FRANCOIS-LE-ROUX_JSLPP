// js/main.js
import { loadTasksFromStorage } from "./storage.js";
import { renderTasks } from "./ui.js";
import { fetchTasksFromAPI } from "./api.js";
import { setupModalHandlers, openTaskModal, openCreateModal } from "./modal.js";
import { setupTheme } from "./sidebar-theme.js";
import { setupSidebarChrome } from "./sidebar.js";

const tasks = loadTasksFromStorage();

// Render helper that keeps the click handler bound
function render(list) {
  renderTasks(list, (task) => openTaskModal(task, tasks, render));
}

// Init UI chrome first (so switches/buttons work immediately)
setupTheme();
setupSidebarChrome();

// Modal plumbing
setupModalHandlers(tasks, render);
document
  .getElementById("open-create-modal")
  ?.addEventListener("click", () => openCreateModal());

// First paint (local), then try API and repaint if it succeeds
render(tasks);
fetchTasksFromAPI(tasks).then(() => render(tasks));
