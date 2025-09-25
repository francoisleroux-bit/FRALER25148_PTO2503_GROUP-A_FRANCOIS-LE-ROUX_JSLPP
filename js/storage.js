import { initialTasks } from "../initialData.js";

const STORAGE_KEY = "kanban.tasks";
const PERSIST = false;

export function loadTasksFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return initialTasks.map((t) => ({ ...t }));
}

export function saveTasksToStorage(tasks) {
  if (!PERSIST) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function nextId(tasks) {
  let max = 0;
  for (const t of tasks) if (t.id > max) max = t.id;
  return max + 1;
}
