// guided exercises 2-1
var UserClass = /** @class */ (function () {
    function UserClass(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = true;
    }
    UserClass.prototype.toggleActive = function () {
        this.active = !this.active;
    };
    return UserClass;
}());
var userList = [];
userList.push(new UserClass(Date.now(), "Abel", "ajdszp@hotmail.com"));
userList.push(new UserClass(Date.now(), "Joel", "jjdszp@hotmail.com"));
var container = document.getElementById("user-list");
renderUsers(userList);
function renderUsers(list) {
    var container = document.getElementById("user-list");
    container.innerHTML = "";
    list.forEach(function (user) {
        var userCardDiv = document.createElement("div");
        userCardDiv.classList.add("user-card");
        userCardDiv.innerHTML = "\n            <h3>".concat(user.name, "</h3>\n            <p>Email: ").concat(user.email, "</p>\n            <p class=\"status ").concat(user.active ? "active" : "inactive", "\">\n                Status: ").concat(user.active ? "Active" : "Inactive", "\n            </p>\n            <p class=\"tasks\">0 assigned tasks</p>\n        ");
        var btnToggle = document.createElement("button");
        btnToggle.textContent = user.active ? "Deactivate" : "Activate";
        if (user.active) {
            btnToggle.classList.add("inactive"); // red
        }
        else {
            btnToggle.classList.add("active"); // green
        }
        btnToggle.addEventListener("click", function () {
            user.toggleActive();
            renderUsers(userList);
        });
        userCardDiv.appendChild(btnToggle);
        container.appendChild(userCardDiv);
    });
    updateCounter();
}
// Create form and inputs/buttons
var form = document.createElement("form");
form.classList.add("form");
var nameInput = document.createElement("input");
nameInput.classList.add("name-input");
nameInput.type = "text";
nameInput.placeholder = "First and last name";
nameInput.required = true;
var emailInput = document.createElement("input");
emailInput.classList.add("email-input");
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true;
var btnAdd = document.createElement("button");
btnAdd.classList.add("btn-add");
btnAdd.textContent = "New user";
// Create filter buttons
var btnShowAll = document.createElement("button");
btnShowAll.textContent = "Show all";
btnShowAll.type = "button";
btnShowAll.classList.add("btn-filter");
btnShowAll.addEventListener("click", function () {
    renderUsers(userList);
});
var btnShowActive = document.createElement("button");
btnShowActive.textContent = "Show active only";
btnShowActive.type = "button";
btnShowActive.classList.add("btn-filter");
btnShowActive.addEventListener("click", function () {
    var activeUsers = userList.filter(function (u) { return u.active; });
    renderUsers(activeUsers);
});
var btnShowInactive = document.createElement("button");
btnShowInactive.textContent = "Show inactive only";
btnShowInactive.type = "button";
btnShowInactive.classList.add("btn-filter");
btnShowInactive.addEventListener("click", function () {
    var inactiveUsers = userList.filter(function (u) { return !u.active; });
    renderUsers(inactiveUsers);
});
// Create containers para inputs e filtros
var inputContainer = document.createElement("div");
inputContainer.classList.add("input-container");
inputContainer.appendChild(nameInput);
inputContainer.appendChild(emailInput);
inputContainer.appendChild(btnAdd);
var filterContainer = document.createElement("div");
filterContainer.classList.add("filter-buttons");
filterContainer.appendChild(btnShowAll);
filterContainer.appendChild(btnShowActive);
filterContainer.appendChild(btnShowInactive);
// Append containers lado a lado dentro do form
form.appendChild(inputContainer);
form.appendChild(filterContainer);
// Adicionar form no container
var formContainer = document.getElementById("form");
formContainer.prepend(form);
// Submit do form
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
        alert("Please fill in the fields correctly. The email must contain '@'.");
        return;
    }
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    userList.push(new UserClass(Date.now(), name, email));
    renderUsers(userList);
    nameInput.value = "";
    emailInput.value = "";
});
// User counter
var counterDiv = document.createElement("div");
counterDiv.id = "user-counter";
counterDiv.style.fontWeight = "bold";
counterDiv.style.marginBottom = "10px";
container.prepend(counterDiv);
function updateCounter() {
    var counter = document.getElementById("user-counter");
    counter.textContent = "Total users: ".concat(userList.length);
}
