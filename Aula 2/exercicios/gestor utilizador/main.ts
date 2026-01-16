// guided exercises 2-1

interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
}

class UserClass implements User {
    id: number;
    name: string;
    email: string;
    active: boolean;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = true;
    }

    toggleActive(): void {
        this.active = !this.active;
    }
}

let userList: UserClass[] = [];
let nextID: number =1;

userList.push(new UserClass(nextID++, "Abel", "ajdszp@hotmail.com"));
userList.push(new UserClass(nextID++, "Joel", "jjdszp@hotmail.com"));

const container = document.getElementById("user-list") as HTMLDivElement;
renderUsers(userList);

function renderUsers(list: UserClass[]): void {
    const container = document.getElementById("user-list") as HTMLDivElement;
    container.innerHTML = "";

    list.forEach(user => {
        const userCardDiv = document.createElement("div");
        userCardDiv.classList.add("user-card");

        // Conteúdo do card
        userCardDiv.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p class="status ${user.active ? "active" : "inactive"}">
                Status: ${user.active ? "Active" : "Inactive"}
            </p>
            <p class="tasks">${0} assigned tasks</p> <!-- ajuste: usar 0 ou sua taskList -->
        `;

        // Container para os botões
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("card-buttons");

        // Exercicio 11* Botão Remover
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove");
        removeBtn.addEventListener("click", e => {
            e.stopPropagation();
            userList = userList.filter(u => u.id !== user.id);
            renderUsers(userList);
        });

        // Botão Ativar / Desativar
        const btnToggle = document.createElement("button");
        btnToggle.textContent = user.active ? "Deactivate" : "Activate";
        btnToggle.classList.add(user.active ? "inactive" : "active");
        btnToggle.addEventListener("click", () => {
            user.toggleActive();
            renderUsers(userList);
        });

        // Adiciona os botões no container
        buttonsDiv.appendChild(removeBtn);
        buttonsDiv.appendChild(btnToggle);

        // Adiciona o container de botões ao card
        userCardDiv.appendChild(buttonsDiv);

        // Adiciona o card no container principal
        container.appendChild(userCardDiv);
    });

    updateCounter();
}

// Create form and inputs/buttons
const form = document.createElement("form");
form.classList.add("form");

const nameInput = document.createElement("input") as HTMLInputElement;
nameInput.classList.add("name-input");
nameInput.type = "text";
nameInput.placeholder = "First and last name";
nameInput.required = true;

const emailInput = document.createElement("input") as HTMLInputElement;
emailInput.classList.add("email-input");
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true;

const btnAdd = document.createElement("button") as HTMLButtonElement;
btnAdd.classList.add("btn-add");
btnAdd.textContent = "New user";

// Create filter buttons
const btnShowAll = document.createElement("button");
btnShowAll.textContent = "Show all";
btnShowAll.type = "button";
btnShowAll.classList.add("btn-filter");
btnShowAll.addEventListener("click", () => {
    renderUsers(userList);
});

const btnShowActive = document.createElement("button");
btnShowActive.textContent = "Show active only";
btnShowActive.type = "button";
btnShowActive.classList.add("btn-filter");
btnShowActive.addEventListener("click", () => {
    const activeUsers = userList.filter(u => u.active);
    renderUsers(activeUsers);
});

const btnShowInactive = document.createElement("button");
btnShowInactive.textContent = "Show inactive only";
btnShowInactive.type = "button";
btnShowInactive.classList.add("btn-filter");
btnShowInactive.addEventListener("click", () => {
    const inactiveUsers = userList.filter(u => !u.active);
    renderUsers(inactiveUsers);
});

// Create containers para inputs e filtros
const inputContainer = document.createElement("div");
inputContainer.classList.add("input-container");
inputContainer.appendChild(nameInput);
inputContainer.appendChild(emailInput);
inputContainer.appendChild(btnAdd);

const filterContainer = document.createElement("div");
filterContainer.classList.add("filter-buttons");
filterContainer.appendChild(btnShowAll);
filterContainer.appendChild(btnShowActive);
filterContainer.appendChild(btnShowInactive);

// Append containers lado a lado dentro do form
form.appendChild(inputContainer);
form.appendChild(filterContainer);

// Adicionar form no container
const formContainer = document.getElementById("form") as HTMLDivElement;
formContainer.prepend(form);

// Submit do form
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        alert("Please fill in the fields correctly. The email must contain '@'.");
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    userList.push(new UserClass(Date.now(), name, email));

    renderUsers(userList);

    nameInput.value = "";
    emailInput.value = "";
});

// User counter
const counterDiv = document.createElement("div");
counterDiv.id = "user-counter";
counterDiv.style.fontWeight = "bold";
counterDiv.style.marginBottom = "10px";

container.prepend(counterDiv);

function updateCounter(): void {
    const counter = document.getElementById("user-counter") as HTMLDivElement;
    counter.textContent = `Total users: ${userList.length}`;
}

//Exercício 12 — Procurar utilizador por nome
let searchTerm: string = "";
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;

searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();

    // Filtra usuários pelo nome
    const filteredUsers = userList.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );

    // Renderiza a lista filtrada
    renderUsers(filteredUsers);
});


//Exercício 13 — Exercício 13 — Contador de utilizadores ativos e inativos