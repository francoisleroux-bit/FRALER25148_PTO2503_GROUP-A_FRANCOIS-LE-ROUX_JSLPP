# JSL Portfolio Piece: Kanban App — Deployment & Features

## Overview

I deployed a fully functional **Kanban application** to Netlify and implemented dynamic task loading, persistent storage, modal-based editing/deletion, a toggleable sidebar, and a dark/light theme. The app is responsive across devices and the codebase is organized into small, well-documented ES modules for maintainability.

---

## What I Implemented

### Data Persistence

- On startup, I **hydrate the board from localStorage** and render tasks into their columns (To Do / Doing / Done) to keep the layout consistent.

### Task Editing & Deletion

- I built a modal that lets users **edit task title, description, and status**.
  Saving immediately updates the UI and localStorage.
- I added a **Delete** button in the modal with a confirmation step.
  On confirm, the task is removed from the board and from localStorage.

### Sidebar Interaction

- I implemented a **toggleable sidebar** that contains the board selector, theme switch, and a **Hide Sidebar** pill.
- Users can **hide/show** the sidebar on desktop. Layout and spacing follow the design spec.

### Mobile Sidebar (Menu)

- On mobile, the sidebar behaves as a **slide-in menu** accessible from the top of the screen.
- The **theme toggle** is available in the mobile menu as well.
- The menu is **closable**, giving users a clean, unobstructed view of their tasks.

### Theme Toggle (Dark/Light Mode)

- I added a **theme toggle switch** that flips between dark and light modes.
- The toggle works in both **desktop** and **mobile** sidebars for consistent behavior.
- All board elements (columns, cards, modal, sidebar) adapt via CSS variables for proper contrast and readability in dark mode.

### Priority System (Implemented)

I implemented the optional **priority** feature:

- Each task can be **High / Medium / Low**.
- Priority is **visualized** with a colored dot on every task card.
- Priority is **editable** in the modal and **persisted** in localStorage.
- Columns **auto-sort** by priority (High → Medium → Low) and then by ID, so important tasks surface to the top—even after refresh.

---

## Code Quality & Maintainability

- I split the code into **focused modules** (API fetch, UI rendering, modal logic, storage, sidebar/theme).
- I used **descriptive names** and added **JSDoc-style comments** to explain responsibilities, parameters, and return values.
- The result is a clean, modular codebase that’s easy to extend and maintain.

---

## Final Outcome

A complete Kanban app that:

- **Fetches tasks dynamically** and replaces any hard-coded data at runtime.
- Supports **editing and deletion** of tasks via a modal, with changes persisted.
- Provides a **responsive**, mobile-friendly **sidebar** and **theme toggle**.
- Is **deployed to Netlify** with a broken public URL.

## Please find my VEED recording below

https://www.veed.io/view/b569a421-b217-47ce-badb-d53f9cea94a5?source=editor&panel=share
