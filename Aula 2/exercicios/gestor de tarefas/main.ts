// ===============================
// GUIDED EXERCISES 2 - MAIN.TS
// ===============================

// Exercise 1 — Create Task interface
interface Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: 'Work' | 'Personal' | 'Study';
}

// Exercise 2 — Create TaskClass class
class TaskClass implements Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: 'Work' | 'Personal' | 'Study';

    // Exercise 2a — Constructor receiving id, title and category
    constructor(id: number, title: string, category: 'Work' | 'Personal' | 'Study') {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.category = category;
    }

    // Exercise 2b — Method to mark task as concluded and set conclusion date
    markConcluded(): void {
        this.concluded = true;
        this.conclusionDate = new Date();
    }
}

// Exercise 3 — Array of objects
let taskList: TaskClass[] = [
    new TaskClass(1, "Review class 2 slides", "Study"),
    new TaskClass(2, "Do guided exercises", "Study"),
    new TaskClass(3, "Do autonomous exercises", "Study")
];

// Variable for dynamic search (Exercise 5)
let searchTerm: string = "";

// ===============================
// Exercise 4 — Add task via input
const input = document.querySelector("#taskInput") as HTMLInputElement;
const categorySelect = document.querySelector("#categorySelect") as HTMLSelectElement;
const buttonAdd = document.querySelector("#addBtn") as HTMLButtonElement;

buttonAdd.addEventListener("click", () => {
    const title = input.value.trim();
    if (!title) return;

    const category = categorySelect.value as 'Work' | 'Personal' | 'Study';

    const newTask = new TaskClass(Date.now(), title, category);
    taskList.push(newTask);

    input.value = "";
    categorySelect.value = "Work";

    renderTasks();
});

// ===============================
// Exercise 12 — Alphabetical Sorting
const sortBtn = document.querySelector("#sortBtn") as HTMLButtonElement;
sortBtn.addEventListener("click", () => {
    taskList.sort((a, b) => a.title.localeCompare(b.title, "pt-PT"));
    renderTasks();
});

// ===============================
// Exercise 14 — Clear all concluded tasks
const clearCompletedBtn = document.querySelector("#clearCompletedBtn") as HTMLButtonElement;
clearCompletedBtn.addEventListener("click", () => {
    taskList = taskList.filter(task => !task.concluded);
    renderTasks();
});

// ===============================
// Exercise 5 — Dynamic Search
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});

// ===============================
// Exercise 5,6,7,8,9,11,13 — Dynamic Rendering
// ===============================
// Exercise 5 — Dynamic rendering
function renderTasks() {
    const taskContainer = document.querySelector("#list") as HTMLUListElement;
    const pendingCountDiv = document.querySelector("#pending-count") as HTMLDivElement;

    // Filter tasks based on searchTerm
    const filteredTasks = taskList.filter(task =>
        task.title.toLowerCase().includes(searchTerm)
    );

    // Calculate number of pending tasks
    const pendingTasks = filteredTasks.filter(t => !t.concluded);
    pendingCountDiv.textContent = `Pending tasks: ${pendingTasks.length}`;

    // Clear container
    taskContainer.innerHTML = "";

    // Loop through filtered tasks
    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content");

        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded) titleSpan.classList.add("completed");
        contentDiv.appendChild(titleSpan);

        const categorySpan = document.createElement("span");
        categorySpan.textContent = ` [${task.category}]`;
        categorySpan.classList.add("task-category");
        switch(task.category) {
            case "Work": categorySpan.style.color = "#1E90FF"; break;
            case "Personal": categorySpan.style.color = "#32CD32"; break;
            case "Study": categorySpan.style.color = "#FF8C00"; break;
        }
        contentDiv.appendChild(categorySpan);

        if (task.concluded && task.conclusionDate) {
            const dateSpan = document.createElement("span");
            const formattedDate = task.conclusionDate.toLocaleString("en-US", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
            dateSpan.textContent = ` (Completed on: ${formattedDate})`;
            dateSpan.classList.add("completed-date");
            contentDiv.appendChild(dateSpan);
        }

        li.appendChild(contentDiv);

        li.addEventListener("click", () => {
            if (!task.concluded) task.markConcluded();
            else { task.concluded = false; task.conclusionDate = undefined; }
            renderTasks();
        });

        li.addEventListener("dblclick", () => {
            const newTitle = prompt("New task title:", task.title);
            if (newTitle && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                renderTasks();
            }
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", e => {
            e.stopPropagation();
            taskList = taskList.filter(t => t.id !== task.id);
            renderTasks();
        });
        li.appendChild(removeBtn);

        taskContainer.appendChild(li);
    });
}

// Initial call
renderTasks();

