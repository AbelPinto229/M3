// ===============================
// TASK MANAGER - MAIN.TS
// ===============================
// Exercise 2 — Create TaskClass implementing Task
var TaskClass = /** @class */ (function () {
    function TaskClass(id, title, category) {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.category = category;
    }
    TaskClass.prototype.markConcluded = function () {
        this.concluded = true;
        this.conclusionDate = new Date();
    };
    return TaskClass;
}());
// ===============================
// DATA
// ===============================
var taskList = [
    new TaskClass(1, "Review class 2 slides", "Study"),
    new TaskClass(2, "Do guided exercises", "Study"),
    new TaskClass(3, "Do autonomous exercises", "Study")
];
var searchTerm = "";
var sortAsc = true;
// ===============================
// ELEMENTS
// ===============================
var input = document.querySelector("#taskInput");
var categorySelect = document.querySelector("#categorySelect");
var buttonAdd = document.querySelector("#addBtn");
var sortBtn = document.querySelector("#sortBtn");
var clearCompletedBtn = document.querySelector("#clearCompletedBtn");
var searchInput = document.querySelector("#searchInput");
// ===============================
// MODAL ELEMENTS
// ===============================
var modalOverlay = document.createElement("div");
var modal = document.createElement("div");
var modalTitle = document.createElement("h2");
var modalInput = document.createElement("input");
modalInput.type = "text";
var modalCategorySelect = document.createElement("select");
["Work", "Personal", "Study"].forEach(function (cat) {
    var option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    modalCategorySelect.appendChild(option);
});
var modalSaveBtn = document.createElement("button");
var modalCancelBtn = document.createElement("button");
modalOverlay.id = "modal-overlay";
modal.id = "modal";
modalTitle.textContent = "Edit Task";
modalSaveBtn.textContent = "Save";
modalCancelBtn.textContent = "Cancel";
modal.append(modalTitle, modalInput, modalCategorySelect, modalSaveBtn, modalCancelBtn);
modalOverlay.appendChild(modal);
document.body.appendChild(modalOverlay);
var taskBeingEdited = null;
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
modalSaveBtn.addEventListener("click", function () {
    if (!taskBeingEdited)
        return;
    var newTitle = modalInput.value.trim();
    var newCategory = modalCategorySelect.value;
    if (!newTitle)
        return;
    taskBeingEdited.title = newTitle;
    taskBeingEdited.category = newCategory;
    renderTasks();
    closeModal();
});
modalCancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay)
        closeModal();
});
// ===============================
// ADD TASK
// ===============================
buttonAdd.addEventListener("click", function () {
    var title = input.value.trim();
    if (!title)
        return;
    var category = categorySelect.value;
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
sortBtn.addEventListener("click", function () {
    taskList.sort(function (a, b) {
        return sortAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
    });
    sortBtn.textContent = sortAsc ? "Sort Z→A" : "Sort A→Z";
    sortAsc = !sortAsc;
    renderTasks();
});
// ===============================
// CLEAR COMPLETED
// ===============================
clearCompletedBtn.addEventListener("click", function () {
    taskList = taskList.filter(function (task) { return !task.concluded; });
    renderTasks();
});
// ===============================
// SEARCH
// ===============================
searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});
// ===============================
// RENDER TASKS
// ===============================
function renderTasks() {
    var taskContainer = document.querySelector("#list");
    var pendingCountDiv = document.querySelector("#pending-count");
    var filteredTasks = taskList.filter(function (task) {
        return task.title.toLowerCase().includes(searchTerm);
    });
    var pendingTasks = filteredTasks.filter(function (task) { return !task.concluded; });
    pendingCountDiv.textContent = "Pending tasks: ".concat(pendingTasks.length);
    taskContainer.innerHTML = "";
    filteredTasks.forEach(function (task) {
        var li = document.createElement("li");
        // ===============================
        // TASK CONTENT
        // ===============================
        var contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content");
        var titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded)
            titleSpan.classList.add("completed");
        contentDiv.appendChild(titleSpan);
        var categorySpan = document.createElement("span");
        categorySpan.textContent = " [".concat(task.category, "]");
        categorySpan.classList.add("task-category");
        switch (task.category) {
            case "Work":
                categorySpan.style.color = "#1E90FF"; // azul
                break;
            case "Personal":
                categorySpan.style.color = "#32CD32"; // verde
                break;
            case "Study":
                categorySpan.style.color = "#FF8C00"; // laranja
                break;
        }
        contentDiv.appendChild(categorySpan);
        if (task.concluded && task.conclusionDate) {
            var dateSpan = document.createElement("span");
            dateSpan.textContent = " (Completed on: ".concat(task.conclusionDate.toLocaleString(), ")");
            dateSpan.classList.add("completed-date");
            contentDiv.appendChild(dateSpan);
        }
        li.appendChild(contentDiv);
        // ===============================
        // TOGGLE CONCLUDED
        // ===============================
        li.addEventListener("click", function () {
            if (!task.concluded) {
                task.markConcluded();
            }
            else {
                task.concluded = false;
                task.conclusionDate = undefined;
            }
            renderTasks();
        });
        // ===============================
        // BUTTONS
        // ===============================
        var buttonContainer = document.createElement("div");
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            openModal(task);
        });
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            taskList = taskList.filter(function (t) { return t.id !== task.id; });
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
