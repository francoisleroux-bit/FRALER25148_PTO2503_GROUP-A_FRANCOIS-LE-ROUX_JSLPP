// js/sidebar.js
export function setupSidebarChrome() {
  const body = document.body;
  const sideBar = document.getElementById("side-bar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const hideBtn = document.getElementById("hide-sidebar");
  const showBtn = document.getElementById("show-sidebar");

  // Mobile slide-in menu
  mobileMenuBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    body.classList.add("menu-open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") body.classList.remove("menu-open");
  });
  // click outside to close (we removed the overlay via CSS, so handle here)
  document.addEventListener("click", (e) => {
    if (!body.classList.contains("menu-open")) return;
    if (sideBar && !sideBar.contains(e.target) && e.target !== mobileMenuBtn) {
      body.classList.remove("menu-open");
    }
  });

  // Hide / show sidebar (desktop)
  hideBtn?.addEventListener("click", () =>
    body.classList.add("sidebar-hidden")
  );
  showBtn?.addEventListener("click", () =>
    body.classList.remove("sidebar-hidden")
  );
}
