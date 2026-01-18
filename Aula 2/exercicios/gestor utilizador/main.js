var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Exercise 2 — UserClass
var UserClass = /** @class */ (function () {
    function UserClass(id, name, email, photo, active) {
        if (active === void 0) { active = true; }
        this.id = id;
        this.name = name;
        this.email = email;
        this.photo = photo;
        this.active = active;
    }
    // Exercise 14 — Toggle Active/Inactive State
    UserClass.prototype.toggleActive = function () {
        this.active = !this.active;
    };
    return UserClass;
}());
// ---------------------------
// DATA
// ---------------------------
// Exercise 3 — Array of users
var userList = [];
var nextID = 1;
var currentDisplayList = [];
// ---------------------------
// CONTAINERS
// ---------------------------
var container = document.getElementById("user-list");
var formContainer = document.getElementById("form");
// ---------------------------
// STATISTICS
// ---------------------------
// Exercise 13 — Active / Inactive counters
var totalUsersSpan = document.getElementById("total-users");
var activeUsersSpan = document.getElementById("active-users");
var inactiveUsersSpan = document.getElementById("inactive-users");
function updateStats(list) {
    if (list === void 0) { list = userList; }
    var total = list.length;
    var active = list.filter(function (u) { return u.active; }).length;
    var inactive = total - active;
    var activePercent = total === 0 ? 0 : Math.round((active / total) * 100);
    var inactivePercent = total === 0 ? 0 : Math.round((inactive / total) * 100);
    totalUsersSpan.textContent = "".concat(total);
    activeUsersSpan.textContent = "".concat(active, " (").concat(activePercent, "%)");
    inactiveUsersSpan.textContent = "".concat(inactive, " (").concat(inactivePercent, "%)");
}
// ---------------------------
// FUNCTION: LOAD INITIAL USERS
// ---------------------------
// Exercise 19 — Simulate initial user data
function loadInitialUsers() {
    var initialData = [
        { name: "Abel Silva", email: "abel@example.com", active: true },
        { name: "Joel Santos", email: "joel@example.com", active: false },
        { name: "Maria Oliveira", email: "maria@example.com", active: true },
        { name: "Ana Costa", email: "ana@example.com", active: false },
        { name: "Carlos Pereira", email: "carlos@example.com", active: true }
    ];
    initialData.forEach(function (data) {
        userList.push(new UserClass(nextID++, data.name, data.email, undefined, data.active));
    });
    currentDisplayList = __spreadArray([], userList, true);
}
// ---------------------------
// RENDER USERS
// ---------------------------
// Exercises 4, 5, 6, 7, 8, 10, 11, 12, 15, 17, 20
function renderUsers(list) {
    container.innerHTML = "";
    if (list.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        updateStats(list);
        return;
    }
    var userModal = document.getElementById("user-modal");
    var modalClose = document.getElementById("modal-close");
    // Modal close events — Exercise 17
    modalClose.onclick = function () { userModal.style.display = "none"; };
    window.onclick = function (e) { if (e.target === userModal)
        userModal.style.display = "none"; };
    list.forEach(function (user) {
        var userCard = document.createElement("div");
        userCard.classList.add("user-card");
        var avatarContent = user.photo
            ? "<img src=\"".concat(user.photo, "\" class=\"user-photo\" alt=\"").concat(user.name, "\">")
            : "<div class=\"user-avatar\">".concat(user.name.charAt(0).toUpperCase(), "</div>");
        userCard.innerHTML = "\n            ".concat(avatarContent, "\n            <h3>").concat(user.name, "</h3>\n            <p class=\"tasks\">0 tasks</p>\n            <p class=\"tasks-concluded\">0 tasks concluded</p>\n        ");
        var cardButtons = document.createElement("div");
        cardButtons.classList.add("card-buttons");
        // Exercise 14 — Toggle Active/Inactive
        var btnToggle = document.createElement("button");
        btnToggle.textContent = user.active ? "Deactivate" : "Activate";
        btnToggle.classList.add(user.active ? "active" : "inactive");
        btnToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            user.toggleActive();
            renderUsers(currentDisplayList);
        });
        // Exercise 11 — Remove user
        var btnRemove = document.createElement("button");
        btnRemove.textContent = "Remove";
        btnRemove.classList.add("remove");
        btnRemove.addEventListener("click", function (e) {
            e.stopPropagation();
            userList = userList.filter(function (u) { return u.id !== user.id; });
            currentDisplayList = currentDisplayList.filter(function (u) { return u.id !== user.id; });
            renderUsers(currentDisplayList);
        });
        cardButtons.append(btnToggle, btnRemove);
        userCard.appendChild(cardButtons);
        // Exercise 17 — Show user details in modal
        userCard.addEventListener("click", function () {
            var statusClass = user.active ? "active" : "inactive";
            var statusText = user.active ? "Active" : "Inactive";
            var modalDetails = document.getElementById("modal-details");
            modalDetails.innerHTML = "\n                <p><strong>ID:</strong> ".concat(user.id, "</p>\n                <p><strong>Name:</strong> ").concat(user.name, "</p>\n                <p><strong>Email:</strong> ").concat(user.email, "</p>\n                <p><strong>Status:</strong> <span class=\"status ").concat(statusClass, "\">").concat(statusText, "</span></p>\n                <p><strong>Assigned tasks:</strong> 0</p>\n                <p><strong>Completed tasks:</strong> 0</p>\n            ");
            userModal.style.display = "block";
        });
        container.appendChild(userCard);
    });
    updateStats(list); // Exercise 9 & 13
}
// ---------------------------
// FORM
// ---------------------------
// Exercise 6 — Add new user via form
var form = document.createElement("form");
form.classList.add("form");
// INPUTS
var nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "First and last name";
nameInput.required = true;
var emailInput = document.createElement("input");
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true;
// PHOTO INPUT
var photoInput = document.createElement("input");
photoInput.type = "file";
photoInput.accept = "image/*";
photoInput.id = "photoInput";
var photoLabel = document.createElement("label");
photoLabel.htmlFor = "photoInput";
photoLabel.textContent = "Profile photo:";
// ADD BUTTON
var btnAdd = document.createElement("button");
btnAdd.type = "submit";
btnAdd.textContent = "New user";
btnAdd.classList.add("btn-add");
// INPUT CONTAINER
var inputContainer = document.createElement("div");
inputContainer.classList.add("input-container");
inputContainer.append(nameInput, emailInput, photoLabel, photoInput, btnAdd);
// ---------------------------
// FILTER BUTTONS
// ---------------------------
// Exercises 8, 15
var sortAsc = true;
var btnSortByName = document.createElement("button");
btnSortByName.type = "button";
btnSortByName.textContent = "Sort A-Z";
btnSortByName.classList.add("btn-filter");
btnSortByName.addEventListener("click", function () {
    currentDisplayList.sort(function (a, b) { return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); });
    renderUsers(currentDisplayList);
    btnSortByName.textContent = sortAsc ? "Sort Z-A" : "Sort A-Z";
    sortAsc = !sortAsc;
});
var btnShowAll = document.createElement("button");
btnShowAll.type = "button";
btnShowAll.textContent = "Show all";
btnShowAll.classList.add("btn-filter");
btnShowAll.addEventListener("click", function () {
    currentDisplayList = __spreadArray([], userList, true);
    renderUsers(currentDisplayList);
});
var btnShowActive = document.createElement("button");
btnShowActive.type = "button";
btnShowActive.textContent = "Show active only";
btnShowActive.classList.add("btn-filter");
btnShowActive.addEventListener("click", function () {
    currentDisplayList = userList.filter(function (u) { return u.active; });
    renderUsers(currentDisplayList);
});
var btnShowInactive = document.createElement("button");
btnShowInactive.type = "button";
btnShowInactive.textContent = "Show inactive only";
btnShowInactive.classList.add("btn-filter");
btnShowInactive.addEventListener("click", function () {
    currentDisplayList = userList.filter(function (u) { return !u.active; });
    renderUsers(currentDisplayList);
});
// FILTER CONTAINER
var filterContainer = document.createElement("div");
filterContainer.classList.add("filter-buttons");
filterContainer.append(btnShowAll, btnShowActive, btnShowInactive, btnSortByName);
// Append form to container
form.append(inputContainer, filterContainer);
formContainer.prepend(form);
// ---------------------------
// FORM SUBMIT
// ---------------------------
// Exercise 6, 16 — Add user
form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var photoURL;
    if (photoInput.files && photoInput.files[0]) {
        photoURL = URL.createObjectURL(photoInput.files[0]);
    }
    // Validation — Exercise 16
    if (!name || !email.includes("@"))
        return;
    userList.push(new UserClass(nextID++, name, email, photoURL));
    currentDisplayList = __spreadArray([], userList, true);
    renderUsers(currentDisplayList);
    nameInput.value = "";
    emailInput.value = "";
    photoInput.value = "";
});
// ---------------------------
// SEARCH
// ---------------------------
// Exercise 12 — Search by name
var searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", function () {
    var term = searchInput.value.trim().toLowerCase();
    currentDisplayList = userList.filter(function (u) { return u.name.toLowerCase().includes(term); });
    renderUsers(currentDisplayList);
});
// ---------------------------
// INITIALIZATION
// ---------------------------
// Exercise 19 — Load initial users
loadInitialUsers();
renderUsers(currentDisplayList);
