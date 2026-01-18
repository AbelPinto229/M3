var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var UserClass = /** @class */ (function () {
    function UserClass(id, name, email, photo, active) {
        if (active === void 0) { active = true; }
        this.id = id;
        this.name = name;
        this.email = email;
        this.photo = photo;
        this.active = active;
    }
    UserClass.prototype.toggleActive = function () {
        this.active = !this.active;
    };
    return UserClass;
}());
// ---------------------------
// DATA
// ---------------------------
var userList = [];
var nextID = 1;
var currentDisplayList = [];
// ---------------------------
// CONTAINERS
// ---------------------------
var container = document.getElementById("user-list");
var formContainer = document.getElementById("form");
// ---------------------------
// ESTATÍSTICAS
// ---------------------------
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
// FUNÇÃO: CARREGAR USUÁRIOS INICIAIS
// ---------------------------
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
function renderUsers(list) {
    container.innerHTML = "";
    if (list.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        updateStats(list);
        return;
    }
    var userModal = document.getElementById("user-modal");
    var modalDetails = document.getElementById("modal-details");
    var modalClose = document.getElementById("modal-close");
    // Modal close events
    modalClose.onclick = function () { userModal.style.display = "none"; };
    window.onclick = function (e) { if (e.target === userModal)
        userModal.style.display = "none"; };
    list.forEach(function (user) {
        var userCard = document.createElement("div");
        userCard.classList.add("user-card");
        var avatarContent = user.photo
            ? "<img src=\"".concat(user.photo, "\" class=\"user-photo\" alt=\"").concat(user.name, "\">")
            : "<div class=\"user-avatar\">".concat(user.name.charAt(0).toUpperCase(), "</div>");
        // Cartão sem ID visível, com contagem de tarefas
        userCard.innerHTML = "\n        ".concat(avatarContent, "\n        <h3>").concat(user.name, "</h3>\n        <p class=\"tasks\">0 tasks</p>\n        <p class=\"tasks-concluded\">0 tasks concluded</p>\n    ");
        // Botões do card
        var cardButtons = document.createElement("div");
        cardButtons.classList.add("card-buttons");
        var btnToggle = document.createElement("button");
        btnToggle.textContent = user.active ? "Desativar" : "Ativar";
        btnToggle.classList.add(user.active ? "active" : "inactive");
        btnToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            user.toggleActive();
            renderUsers(currentDisplayList);
        });
        var btnRemove = document.createElement("button");
        btnRemove.textContent = "Remover";
        btnRemove.classList.add("remove");
        btnRemove.addEventListener("click", function (e) {
            e.stopPropagation();
            userList = userList.filter(function (u) { return u.id !== user.id; });
            currentDisplayList = currentDisplayList.filter(function (u) { return u.id !== user.id; });
            renderUsers(currentDisplayList);
        });
        cardButtons.append(btnToggle, btnRemove);
        userCard.appendChild(cardButtons);
        // Modal click (mostra ID apenas no modal, não no cartão)
        userCard.addEventListener("click", function () {
            var statusClass = user.active ? "active" : "inactive";
            var statusText = user.active ? "Active" : "Inactive";
            var modalDetails = document.getElementById("modal-details");
            modalDetails.innerHTML = "\n            <p><strong>ID:</strong> ".concat(user.id, "</p>\n            <p><strong>Nome:</strong> ").concat(user.name, "</p>\n            <p><strong>Email:</strong> ").concat(user.email, "</p>\n            <p><strong>Status:</strong> <span class=\"status ").concat(statusClass, "\">").concat(statusText, "</span></p>\n            <p><strong>Tarefas atribu\u00EDdas:</strong> 0</p>\n            <p><strong>Tarefas conclu\u00EDdas:</strong> 0</p>\n        ");
            var userModal = document.getElementById("user-modal");
            userModal.style.display = "block";
        });
        container.appendChild(userCard);
    });
    updateStats(list);
}
// ---------------------------
// FORMULÁRIO
// ---------------------------
var form = document.createElement("form");
form.classList.add("form");
var nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "First and last name";
nameInput.required = true;
var emailInput = document.createElement("input");
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true;
var photoInput = document.createElement("input");
photoInput.type = "file";
photoInput.accept = "image/*";
var btnAdd = document.createElement("button");
btnAdd.type = "submit";
btnAdd.textContent = "New user";
btnAdd.classList.add("btn-add");
// Filtros e ordenação
var sortAsc = true;
var btnSortByName = document.createElement("button");
btnSortByName.type = "button";
btnSortByName.textContent = "Ordenar A-Z";
btnSortByName.classList.add("btn-filter");
btnSortByName.addEventListener("click", function () {
    currentDisplayList.sort(function (a, b) { return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); });
    renderUsers(currentDisplayList);
    btnSortByName.textContent = sortAsc ? "Ordenar Z-A" : "Ordenar A-Z";
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
// Append form
var inputContainer = document.createElement("div");
inputContainer.classList.add("input-container");
inputContainer.append(nameInput, emailInput, photoInput, btnAdd);
var filterContainer = document.createElement("div");
filterContainer.classList.add("filter-buttons");
filterContainer.append(btnShowAll, btnShowActive, btnShowInactive, btnSortByName);
form.append(inputContainer, filterContainer);
formContainer.prepend(form);
// Evento do form
form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var photoURL;
    if (photoInput.files && photoInput.files[0]) {
        photoURL = URL.createObjectURL(photoInput.files[0]);
    }
    userList.push(new UserClass(nextID++, name, email, photoURL));
    currentDisplayList = __spreadArray([], userList, true);
    renderUsers(currentDisplayList);
    nameInput.value = "";
    emailInput.value = "";
    photoInput.value = "";
});
// Search
var searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", function () {
    var term = searchInput.value.trim().toLowerCase();
    currentDisplayList = userList.filter(function (u) { return u.name.toLowerCase().includes(term); });
    renderUsers(currentDisplayList);
});
// ---------------------------
// INICIALIZAÇÃO
// ---------------------------
loadInitialUsers();
renderUsers(currentDisplayList);
