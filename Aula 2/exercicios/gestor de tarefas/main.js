// ===============================
// TASK MANAGER - MAIN.TS
// ===============================
// Exercise 2 — Create TaskClass implementing Task
var TaskClass = /** @class */ (function () {
    function TaskClass(id, title, category) {
        this.id = id;
        this.title = title;
        this.concluded = false;
        this.category = category; //Exercise 13 — category assignment
    }
    //Exercise 2 — Array of objects
    TaskClass.prototype.markConcluded = function () {
        this.concluded = true;
        this.conclusionDate = new Date();
    };
    return TaskClass;
}());
//Exercise 3 — Array of objects
var taskList = [
    new TaskClass(1, "Review class 2 slides", "Study"),
    new TaskClass(2, "Do guided exercises", "Study"),
    new TaskClass(3, "Do autonomous exercises", "Study")
];
// Dynamic search term (Exercise 5 — Array of objects — Dynamic Search)
var searchTerm = "";
// Sort state (Exercise 12 — Array of objects2 — Alphabetical Sorting)
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
//Exercise 4 — Add Task via Input
buttonAdd.addEventListener("click", function () {
    var title = input.value.trim();
    if (!title)
        return;
    var category = categorySelect.value;
    var newTask = new TaskClass(Date.now(), title, category);
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
sortBtn.addEventListener("click", function () {
    taskList.sort(function (a, b) {
        return sortAsc
            ? a.title.localeCompare(b.title, "en-US")
            : b.title.localeCompare(a.title, "en-US");
    });
    sortBtn.textContent = sortAsc ? "Sort Z→A" : "Sort A→Z";
    sortAsc = !sortAsc;
    renderTasks();
});
// ===============================
// Exercise 14 — Clear all completed tasks
clearCompletedBtn.addEventListener("click", function () {
    taskList = taskList.filter(function (task) { return !task.concluded; });
    renderTasks();
});
// ===============================
// Exercise 15— Dynamic Search
searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});
// ===============================
//Exercise 5,6,7,8,9,11 — Dynamic Rendering, Styling, Edit/Remove, Pending Counter, Conclusion Date
function renderTasks() {
    var taskContainer = document.querySelector("#list");
    var pendingCountDiv = document.querySelector("#pending-count");
    //Filter tasks by search
    var filteredTasks = taskList.filter(function (task) {
        return task.title.toLowerCase().includes(searchTerm);
    });
    //Exercise 9 Pending tasks counter
    var pendingTasks = filteredTasks.filter(function (t) { return !t.concluded; });
    pendingCountDiv.textContent = "Pending tasks: ".concat(pendingTasks.length);
    // Clear current list (Exercise 5 — render)
    taskContainer.innerHTML = "";
    filteredTasks.forEach(function (task) {
        var li = document.createElement("li");
        // Task content (Exercise 6 — Styling by state)
        var contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content");
        var titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleSpan.classList.add("task-title");
        if (task.concluded)
            titleSpan.classList.add("completed"); // Exercise 6
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
        //Exercise 11 — Show conclusion date if completed
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
        // Exercise 1, 6 — Mark concluded on click
        li.addEventListener("click", function () {
            if (!task.concluded)
                task.markConcluded();
            else {
                task.concluded = false;
                task.conclusionDate = undefined;
            }
            renderTasks();
        });
        //Exercise 7, 8 — Buttons container: Edit & Remove
        var buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        // Edit button
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            var newTitle = prompt("New task title:", task.title);
            if (newTitle && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                renderTasks();
            }
        });
        // Remove button
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            taskList = taskList.filter(function (t) { return t.id !== task.id; });
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
