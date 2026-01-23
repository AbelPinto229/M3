// ===============================
// MAIN TASK
// ===============================
import { addTask, getAllTasks, clearCompletedTasks } from "./services/taskService.js";
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
    const addBtn = document.getElementById("addBtn");
    const taskInput = document.getElementById("taskInput");
    const categorySelect = document.getElementById("categorySelect");
    const sortBtn = document.getElementById("sortBtn");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    addBtn.addEventListener("click", () => {
        const title = taskInput.value.trim();
        const category = categorySelect.value;
        if (!title)
            return;
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
