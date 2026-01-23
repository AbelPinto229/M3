// ===============================
// MAIN TASK
// ===============================

import { TaskClass } from "./models/task.js";
import { addTask, getAllTasks, removeTask, clearCompletedTasks } from "./services/taskService.js";
import { renderTasks } from "./ui/renderTask.js";

window.addEventListener("DOMContentLoaded", () => {

  // Adiciona tasks iniciais
  addTask("Review slides", "Study");
  addTask("Do guided exercises", "Study");
  addTask("Extra task", "Work");

  // Renderiza tasks
  renderTasks(getAllTasks());

  // ============================
  // BOTÕES
  // ============================
  const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
  const taskInput = document.getElementById("taskInput") as HTMLInputElement;
  const categorySelect = document.getElementById("categorySelect") as HTMLSelectElement;
  const sortBtn = document.getElementById("sortBtn") as HTMLButtonElement;
  const clearCompletedBtn = document.getElementById("clearCompletedBtn") as HTMLButtonElement;

  addBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    const category = categorySelect.value as "Work" | "Personal" | "Study";

    if (!title) return;

    addTask(title, category);
    taskInput.value = "";
    renderTasks(getAllTasks());
  });

  sortBtn.addEventListener("click", () => {
    const tasks = getAllTasks();
    tasks.sort((a, b) => a.title.localeCompare(b.title));
    renderTasks(tasks);
  });

  clearCompletedBtn.addEventListener("click", () => {
    clearCompletedTasks();
    renderTasks(getAllTasks());
  });
});
