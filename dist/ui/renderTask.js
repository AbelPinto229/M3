import { getAllTasks } from "../services/taskService.js";
const taskContainer = document.querySelector("#list");
const pendingCountDiv = document.querySelector("#pending-count");
export const renderTasks = (tasks) => {
    taskContainer.innerHTML = "";
    const pendingTasks = tasks.filter(task => !task.concluded);
    pendingCountDiv.textContent = `Pending tasks: ${pendingTasks.length}`;
    tasks.forEach(task => {
        const li = document.createElement("li");
        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        if (task.concluded)
            titleSpan.classList.add("completed");
        li.appendChild(titleSpan);
        li.addEventListener("click", () => {
            task.concluded = !task.concluded;
            if (task.concluded)
                task.conclusionDate = new Date();
            renderTasks(getAllTasks());
        });
        taskContainer.appendChild(li);
    });
};
