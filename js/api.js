import { saveTasksToStorage } from "./storage.js";
import { setStatusMessage } from "./ui.js";

const API_URL =
  location.hostname === "127.0.0.1" || location.hostname === "localhost"
    ? "./api/tasks.json"
    : "https://kanban.netlify.app/api/tasks.json";

const BOARD_NAME = "Launch Career";

function inheritPriority(id, currentList) {
  const found = currentList.find((t) => +t.id === +id);
  const p = (found?.priority || "medium").toLowerCase();
  return p === "high" || p === "medium" || p === "low" ? p : "medium";
}

export async function fetchTasksFromAPI(tasksRef) {
  setStatusMessage("Loading tasks…", false);
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const api = await res.json();
    const next = api.map((t, i) => {
      const id = Number(t.id ?? i + 1);
      return {
        id,
        title: String(t.title ?? "Untitled"),
        description: String(t.description ?? ""),
        status: String(t.status ?? "todo").toLowerCase(),
        priority: inheritPriority(id, tasksRef),
        board: BOARD_NAME,
      };
    });

    tasksRef.splice(0, tasksRef.length, ...next);
    saveTasksToStorage(tasksRef);
    setStatusMessage("", false);
    return true;
  } catch (err) {
    console.error("[fetchTasksFromAPI]", err);
    setStatusMessage("Error loading tasks — using saved data.", true);
    return false;
  }
}
