import { TaskClass } from "../models/task.js";
import { addTask, getAllTasks, removeTask, getNextTaskID } from "../services/taskService.js";
// ===============================
// STATE
// ===============================
let searchTerm = "";
let taskBeingEdited = null;
// ===============================
// MODAL ELEMENTS
// ===============================
const modalOverlay = document.createElement("div");
modalOverlay.id = "modal-overlay";
const modal = document.createElement("div");
modal.id = "modal";
const modalTitle = document.createElement("h2");
modalTitle.textContent = "Edit Task";
const modalInput = document.createElement("input");
modalInput.type = "text";
const modalCategorySelect = document.createElement("select");
['Work', 'Personal', 'Study'].forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    modalCategorySelect.appendChild(option);
});
const modalSaveBtn = document.createElement("button");
modalSaveBtn.textContent = "Save";
const modalCancelBtn = document.createElement("button");
modalCancelBtn.textContent = "Cancel";
modal.append(modalTitle, modalInput, modalCategorySelect, modalSaveBtn, modalCancelBtn);
modalOverlay.appendChild(modal);
document.body.appendChild(modalOverlay);
// ===============================
// MODAL FUNCTIONS
// ===============================
function openModal(task) {
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
    if (!taskBeingEdited)
        return;
    const newTitle = modalInput.value.trim();
    const newCategory = modalCategorySelect.value;
    if (!newTitle)
        return;
    taskBeingEdited.title = newTitle;
    taskBeingEdited.category = newCategory;
    renderTasks(getAllTasks());
    closeModal();
});
modalCancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
    if (e.target === modalOverlay)
        closeModal();
});
// ===============================
// RENDER TASKS
// ===============================
export const renderTasks = (tasks) => {
    const taskContainer = document.querySelector("#list");
    const pendingCountDiv = document.querySelector("#pending-count");
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
    pendingCountDiv.textContent =
        `Pending tasks: ${filteredTasks.filter(t => !t.concluded).length}`;
    taskContainer.innerHTML = "";
    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content");
        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded)
            titleSpan.classList.add("completed");
        contentDiv.appendChild(titleSpan);
        const categorySpan = document.createElement("span");
        categorySpan.textContent = ` [${task.category}]`;
        categorySpan.classList.add("task-category", task.category.toLowerCase());
        contentDiv.appendChild(categorySpan);
        if (task.concluded && task.conclusionDate) {
            const dateSpan = document.createElement("span");
            dateSpan.textContent =
                ` (Completed on: ${task.conclusionDate.toLocaleString()})`;
            dateSpan.classList.add("completed-date");
            contentDiv.appendChild(dateSpan);
        }
        li.appendChild(contentDiv);
        // ✅ TOGGLE CONCLUDED (ignora cliques em botões)
        li.addEventListener("click", e => {
            if (e.target.tagName === "BUTTON")
                return;
            if (!task.concluded)
                task.markConcluded();
            else {
                task.concluded = false;
                task.conclusionDate = undefined;
            }
            renderTasks(getAllTasks());
        });
        // BUTTONS
        const btnDiv = document.createElement("div");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", e => {
            e.stopPropagation();
            openModal(task);
        });
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", e => {
            e.stopPropagation();
            removeTask(task.id);
            renderTasks(getAllTasks());
        });
        btnDiv.append(editBtn, removeBtn);
        li.appendChild(btnDiv);
        taskContainer.appendChild(li);
    });
};
// ===============================
// RENDER FORM + EVENTS
// ===============================
export const renderTaskForm = () => {
    const input = document.querySelector("#taskInput");
    const categorySelect = document.querySelector("#categorySelect");
    const buttonAdd = document.querySelector("#addBtn");
    const sortBtn = document.querySelector("#sortBtn");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
    const searchInput = document.querySelector("#searchInput");
    // ADD TASK
    buttonAdd.addEventListener("click", () => {
        const title = input.value.trim();
        if (!title)
            return;
        const category = categorySelect.value;
        addTask(new TaskClass(getNextTaskID(), title, category));
        input.value = "";
        categorySelect.value = "Work";
        searchInput.value = "";
        searchTerm = "";
        renderTasks(getAllTasks());
    });
    // SORT
    let sortAsc = true;
    sortBtn.addEventListener("click", () => {
        const sorted = getAllTasks().sort((a, b) => sortAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title));
        sortAsc = !sortAsc;
        sortBtn.textContent = sortAsc ? "Sort Z→A" : "Sort A→Z";
        renderTasks(sorted);
    });
    // CLEAR COMPLETED
    clearCompletedBtn.addEventListener("click", () => {
        getAllTasks().forEach(t => {
            if (t.concluded)
                removeTask(t.id);
        });
        renderTasks(getAllTasks());
    });
    // SEARCH
    searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value.trim().toLowerCase();
        renderTasks(getAllTasks());
    });
};
