import { loadInitialTasks } from "./services/taskService.js";
import { renderTasks, renderTaskForm } from "./ui/renderTask.js";
window.addEventListener("DOMContentLoaded", () => {
    const initialTasks = loadInitialTasks(); // retorna TaskClass[]
    renderTaskForm();
    renderTasks(initialTasks); // agora OK
});
