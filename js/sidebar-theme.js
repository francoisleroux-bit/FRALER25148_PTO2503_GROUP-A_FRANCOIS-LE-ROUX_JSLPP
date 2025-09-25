// js/sidebar-theme.js
const THEME_KEY = "kanban.theme";

/** Apply + persist theme, keep the logo in sync */
function applyTheme(mode) {
  const body = document.body;
  const logo = document.getElementById("logo");
  body.classList.toggle("dark", mode === "dark");
  localStorage.setItem(THEME_KEY, mode);
  if (logo) {
    logo.src =
      mode === "dark" ? "./assets/logo-dark.svg" : "./assets/logo-light.svg";
  }
  const switchEl = document.getElementById("theme-switch");
  if (switchEl) switchEl.checked = mode === "dark";
}

export function setupTheme() {
  // initial
  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  // toggle
  const switchEl = document.getElementById("theme-switch");
  switchEl?.addEventListener("change", (e) => {
    applyTheme(e.target.checked ? "dark" : "light");
  });
}
