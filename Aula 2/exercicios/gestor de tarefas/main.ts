// ===============================
// TASK MANAGER - MAIN.TS
// ===============================

//Exercise 1 — Create Task interface
interface Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date; //Exercise 11 (date of conclusion)
    category: 'Work' | 'Personal' | 'Study'; // Exercise 13 — Categories with Literal Types
}

// Exercise 2 — Create TaskClass implementing Task
class TaskClass implements Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: 'Work' | 'Personal' | 'Study';

    constructor(id: number, title: string, category: 'Work' | 'Personal' | 'Study') {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.category = category; //Exercise 13 — category assignment
    }
//Exercise 2 — Array of objects
    markConcluded(): void {
        this.concluded = true;
        this.conclusionDate = new Date();
    }
}

//Exercise 3 — Array of objects
let taskList: TaskClass[] = [
    new TaskClass(1, "Review class 2 slides", "Study"),
    new TaskClass(2, "Do guided exercises", "Study"),
    new TaskClass(3, "Do autonomous exercises", "Study")
];

// Dynamic search term (Exercise 5 — Array of objects — Dynamic Search)
let searchTerm: string = "";

// Sort state (Exercise 12 — Array of objects2 — Alphabetical Sorting)
let sortAsc = true;

// ===============================
// ELEMENTS
// ===============================
const input = document.querySelector("#taskInput") as HTMLInputElement;
const categorySelect = document.querySelector("#categorySelect") as HTMLSelectElement;
const buttonAdd = document.querySelector("#addBtn") as HTMLButtonElement;
const sortBtn = document.querySelector("#sortBtn") as HTMLButtonElement;
const clearCompletedBtn = document.querySelector("#clearCompletedBtn") as HTMLButtonElement;
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;

// ===============================
//Exercise 4 — Add Task via Input
buttonAdd.addEventListener("click", () => {
    const title = input.value.trim();
    if (!title) return;

    const category = categorySelect.value as 'Work' | 'Personal' | 'Study';
    const newTask = new TaskClass(Date.now(), title, category);
    taskList.push(newTask);

    // Reset input and search
    input.value = "";
    categorySelect.value = "Work";
    searchTerm = "";
    searchInput.value = "";

    renderTasks();
});

// ===============================
// Exercise 12 — Alphabetical Sorting / toggle A-Z / Z-A
sortBtn.addEventListener("click", () => {
    taskList.sort((a, b) => 
        sortAsc 
            ? a.title.localeCompare(b.title, "en-US") 
            : b.title.localeCompare(a.title, "en-US")
    );
    sortBtn.textContent = sortAsc ? "Sort Z→A" : "Sort A→Z";
    sortAsc = !sortAsc;

    renderTasks();
});

// ===============================
// Exercise 14 — Clear all completed tasks
clearCompletedBtn.addEventListener("click", () => {
    taskList = taskList.filter(task => !task.concluded);
    renderTasks();
});

// ===============================
// Exercise 15— Dynamic Search
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});

// ===============================
//Exercise 5,6,7,8,9,11 — Dynamic Rendering, Styling, Edit/Remove, Pending Counter, Conclusion Date
function renderTasks() {
    const taskContainer = document.querySelector("#list") as HTMLUListElement;
    const pendingCountDiv = document.querySelector("#pending-count") as HTMLDivElement;

    //Filter tasks by search
    const filteredTasks = taskList.filter(task =>
        task.title.toLowerCase().includes(searchTerm)
    );

    //Exercise 9 Pending tasks counter
    const pendingTasks = filteredTasks.filter(t => !t.concluded);
    pendingCountDiv.textContent = `Pending tasks: ${pendingTasks.length}`;

    // Clear current list (Exercise 5 — render)
    taskContainer.innerHTML = "";

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        // Task content (Exercise 6 — Styling by state)
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content");

        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded) titleSpan.classList.add("completed"); // Exercise 6
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

        //Exercise 11 — Show conclusion date if completed
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

        // Exercise 1, 6 — Mark concluded on click
        li.addEventListener("click", () => {
            if (!task.concluded) task.markConcluded();
            else { task.concluded = false; task.conclusionDate = undefined; }
            renderTasks();
        });

        //Exercise 7, 8 — Buttons container: Edit & Remove
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", e => {
            e.stopPropagation();
            const newTitle = prompt("New task title:", task.title);
            if (newTitle && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                renderTasks();
            }
        });

        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", e => {
            e.stopPropagation();
            taskList = taskList.filter(t => t.id !== task.id);
            renderTasks();
        });

        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(removeBtn);
        li.appendChild(buttonContainer);

        taskContainer.appendChild(li);
    });
}

// Initial render
renderTasks();
