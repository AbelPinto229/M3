// ===============================
// TASK MANAGER - MAIN.TS
// ===============================

// Exercise 1 — Create Task interface
interface Task {
    id: number;
    title: string;
    concluded: boolean;
    conclusionDate?: Date;
    category: 'Work' | 'Personal' | 'Study';
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
        this.category = category;
    }

    markConcluded(): void {
        this.concluded = true;
        this.conclusionDate = new Date();
    }
}

// ===============================
// DATA
// ===============================
let taskList: TaskClass[] = [
    new TaskClass(1, "Review class 2 slides", "Study"),
    new TaskClass(2, "Do guided exercises", "Study"),
    new TaskClass(3, "Do autonomous exercises", "Study")
];

let searchTerm = "";
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
// MODAL ELEMENTS
// ===============================
const modalOverlay = document.createElement("div") as HTMLDivElement;
const modal = document.createElement("div") as HTMLDivElement;
const modalTitle = document.createElement("h2") as HTMLHeadingElement;

const modalInput = document.createElement("input") as HTMLInputElement;
modalInput.type = "text";

const modalCategorySelect = document.createElement("select") as HTMLSelectElement;
(["Work", "Personal", "Study"] as const).forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    modalCategorySelect.appendChild(option);
});

const modalSaveBtn = document.createElement("button") as HTMLButtonElement;
const modalCancelBtn = document.createElement("button") as HTMLButtonElement;

modalOverlay.id = "modal-overlay";
modal.id = "modal";
modalTitle.textContent = "Edit Task";
modalSaveBtn.textContent = "Save";
modalCancelBtn.textContent = "Cancel";

modal.append(
    modalTitle,
    modalInput,
    modalCategorySelect,
    modalSaveBtn,
    modalCancelBtn
);

modalOverlay.appendChild(modal);
document.body.appendChild(modalOverlay);

let taskBeingEdited: TaskClass | null = null;

// ===============================
// MODAL FUNCTIONS
// ===============================
function openModal(task: TaskClass) {
    taskBeingEdited = task;
    modalInput.value = task.title;
    modalCategorySelect.value = task.category;
    modalOverlay.style.display = "flex";
    modalInput.focus();
}

function closeModal() {
    taskBeingEdited = null;
    modalOverlay.style.display = "none";
}

// ===============================
// MODAL EVENTS
// ===============================
modalSaveBtn.addEventListener("click", () => {
    if (!taskBeingEdited) return;

    const newTitle = modalInput.value.trim();
    const newCategory = modalCategorySelect.value as 'Work' | 'Personal' | 'Study';

    if (!newTitle) return;

    taskBeingEdited.title = newTitle;
    taskBeingEdited.category = newCategory;

    renderTasks();
    closeModal();
});

modalCancelBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", e => {
    if (e.target === modalOverlay) closeModal();
});

// ===============================
// ADD TASK
// ===============================
buttonAdd.addEventListener("click", () => {
    const title = input.value.trim();
    if (!title) return;

    const category = categorySelect.value as 'Work' | 'Personal' | 'Study';
    taskList.push(new TaskClass(Date.now(), title, category));

    input.value = "";
    categorySelect.value = "Work";
    searchInput.value = "";
    searchTerm = "";

    renderTasks();
});

// ===============================
// SORT
// ===============================
sortBtn.addEventListener("click", () => {
    taskList.sort((a, b) =>
        sortAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
    );
    sortBtn.textContent = sortAsc ? "Sort Z→A" : "Sort A→Z";
    sortAsc = !sortAsc;

    renderTasks();
});

// ===============================
// CLEAR COMPLETED
// ===============================
clearCompletedBtn.addEventListener("click", () => {
    taskList = taskList.filter(task => !task.concluded);
    renderTasks();
});

// ===============================
// SEARCH
// ===============================
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});

// ===============================
// RENDER TASKS
// ===============================
function renderTasks() {
    const taskContainer = document.querySelector("#list") as HTMLUListElement;
    const pendingCountDiv = document.querySelector("#pending-count") as HTMLDivElement;

    const filteredTasks = taskList.filter(task =>
        task.title.toLowerCase().includes(searchTerm)
    );

    const pendingTasks = filteredTasks.filter(task => !task.concluded);
    pendingCountDiv.textContent = `Pending tasks: ${pendingTasks.length}`;

    taskContainer.innerHTML = "";

    filteredTasks.forEach(task => {
        const li = document.createElement("li") as HTMLLIElement;

        // ===============================
        // TASK CONTENT
        // ===============================
        const contentDiv = document.createElement("div") as HTMLDivElement;
        contentDiv.classList.add("task-content");

        const titleSpan = document.createElement("span") as HTMLSpanElement;
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded) titleSpan.classList.add("completed");
        contentDiv.appendChild(titleSpan);

        const categorySpan = document.createElement("span") as HTMLSpanElement;
        categorySpan.textContent = ` [${task.category}]`;
        categorySpan.classList.add("task-category");

        switch (task.category) {
            case "Work":
                break;
            case "Personal":
                break;
            case "Study":
                break;
        }

        contentDiv.appendChild(categorySpan);

        if (task.concluded && task.conclusionDate) {
            const dateSpan = document.createElement("span") as HTMLSpanElement;
            dateSpan.textContent = ` (Completed on: ${task.conclusionDate.toLocaleString()})`;
            dateSpan.classList.add("completed-date");
            contentDiv.appendChild(dateSpan);
        }

        li.appendChild(contentDiv);

        // ===============================
        // TOGGLE CONCLUDED
        // ===============================
        li.addEventListener("click", () => {
            if (!task.concluded) {
                task.markConcluded();
            } else {
                task.concluded = false;
                task.conclusionDate = undefined;
            }
            renderTasks();
        });

        // ===============================
        // BUTTONS
        // ===============================
        const buttonContainer = document.createElement("div") as HTMLDivElement;

        const editBtn = document.createElement("button") as HTMLButtonElement;
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", e => {
            e.stopPropagation();
            openModal(task);
        });

        const removeBtn = document.createElement("button") as HTMLButtonElement;
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", e => {
            e.stopPropagation();
            taskList = taskList.filter(t => t.id !== task.id);
            renderTasks();
        });

        buttonContainer.append(editBtn, removeBtn);
        li.appendChild(buttonContainer);

        taskContainer.appendChild(li);
    });
}

// ===============================
// INITIAL RENDER
// ===============================
renderTasks();
