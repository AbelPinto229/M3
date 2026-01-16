// ===============================
// GUIDED EXERCISES 2 - MAIN.TS
// ===============================
// Exercise 2 — Create TaskClass class
var TaskClass = /** @class */ (function () {
    // Exercise 2a — Constructor receiving id, title and category
    function TaskClass(id, title, category) {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.category = category;
    }
    // Exercise 2b — Method to mark task as concluded and set conclusion date
    TaskClass.prototype.markConcluded = function () {
        this.concluded = true;
        this.conclusionDate = new Date();
    };
    return TaskClass;
}());
// Exercise 3 — Array of objects
var taskList = [
    new TaskClass(1, "Review class 2 slides", "Study"),
    new TaskClass(2, "Do guided exercises", "Study"),
    new TaskClass(3, "Do autonomous exercises", "Study")
];
// Variable for dynamic search (Exercise 5)
var searchTerm = "";
// ===============================
// Exercise 4 — Add task via input
var input = document.querySelector("#taskInput");
var categorySelect = document.querySelector("#categorySelect");
var buttonAdd = document.querySelector("#addBtn");
buttonAdd.addEventListener("click", function () {
    var title = input.value.trim();
    if (!title)
        return;
    var category = categorySelect.value;
    var newTask = new TaskClass(Date.now(), title, category);
    taskList.push(newTask);
    input.value = "";
    categorySelect.value = "Work";
    renderTasks();
});
// ===============================
// Exercise 12 — Alphabetical Sorting
var sortBtn = document.querySelector("#sortBtn");
sortBtn.addEventListener("click", function () {
    taskList.sort(function (a, b) { return a.title.localeCompare(b.title, "pt-PT"); });
    renderTasks();
});
// ===============================
// Exercise 14 — Clear all concluded tasks
var clearCompletedBtn = document.querySelector("#clearCompletedBtn");
clearCompletedBtn.addEventListener("click", function () {
    taskList = taskList.filter(function (task) { return !task.concluded; });
    renderTasks();
});
// ===============================
// Exercise 5 — Dynamic Search
var searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});
// ===============================
// Exercise 5,6,7,8,9,11,13 — Dynamic Rendering
// ===============================
// Exercise 5 — Dynamic rendering
function renderTasks() {
    var taskContainer = document.querySelector("#list");
    var pendingCountDiv = document.querySelector("#pending-count");
    // Filter tasks based on searchTerm
    var filteredTasks = taskList.filter(function (task) {
        return task.title.toLowerCase().includes(searchTerm);
    });
    // Calculate number of pending tasks
    var pendingTasks = filteredTasks.filter(function (t) { return !t.concluded; });
    pendingCountDiv.textContent = "Pending tasks: ".concat(pendingTasks.length);
    // Clear container
    taskContainer.innerHTML = "";
    // Loop through filtered tasks
    filteredTasks.forEach(function (task) {
        var li = document.createElement("li");
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
                categorySpan.style.color = "#1E90FF";
                break;
            case "Personal":
                categorySpan.style.color = "#32CD32";
                break;
            case "Study":
                categorySpan.style.color = "#FF8C00";
                break;
        }
        contentDiv.appendChild(categorySpan);
        if (task.concluded && task.conclusionDate) {
            var dateSpan = document.createElement("span");
            var formattedDate = task.conclusionDate.toLocaleString("en-US", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
            dateSpan.textContent = " (Completed on: ".concat(formattedDate, ")");
            dateSpan.classList.add("completed-date");
            contentDiv.appendChild(dateSpan);
        }
        li.appendChild(contentDiv);
        li.addEventListener("click", function () {
            if (!task.concluded)
                task.markConcluded();
            else {
                task.concluded = false;
                task.conclusionDate = undefined;
            }
            renderTasks();
        });
        li.addEventListener("dblclick", function () {
            var newTitle = prompt("New task title:", task.title);
            if (newTitle && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                renderTasks();
            }
        });
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            taskList = taskList.filter(function (t) { return t.id !== task.id; });
            renderTasks();
        });
        li.appendChild(removeBtn);
        taskContainer.appendChild(li);
    });
}
// Initial call
renderTasks();
