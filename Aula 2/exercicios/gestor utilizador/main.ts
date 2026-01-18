interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    photo?: string;
}

class UserClass implements User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    photo?: string;

    constructor(id: number, name: string, email: string, photo?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = true;
        this.photo = photo;
    }

    toggleActive(): void {
        this.active = !this.active;
    }
}

// ---------------------------
// DATA
// ---------------------------
let userList: UserClass[] = [];
let nextID: number = 1;

// Usuários iniciais
userList.push(new UserClass(nextID++, "Abel", "ajdszp@hotmail.com"));
userList.push(new UserClass(nextID++, "Joel", "jjdszp@hotmail.com"));

// ---------------------------
// CONTAINERS
// ---------------------------
const container = document.getElementById("user-list") as HTMLDivElement;
const formContainer = document.getElementById("form") as HTMLDivElement;

// ---------------------------
// ESTATÍSTICAS
// ---------------------------
const totalUsersSpan = document.getElementById("total-users") as HTMLSpanElement;
const activeUsersSpan = document.getElementById("active-users") as HTMLSpanElement;
const inactiveUsersSpan = document.getElementById("inactive-users") as HTMLSpanElement;

function updateStats(list: UserClass[] = userList): void {
    const total = list.length;
    const active = list.filter(u => u.active).length;
    const inactive = total - active;

    const activePercent = total === 0 ? 0 : Math.round((active / total) * 100);
    const inactivePercent = total === 0 ? 0 : Math.round((inactive / total) * 100);

    totalUsersSpan.textContent = `${total}`;
    activeUsersSpan.textContent = `${active} (${activePercent}%)`;
    inactiveUsersSpan.textContent = `${inactive} (${inactivePercent}%)`;
}

// ---------------------------
// LISTA ATUAL VISÍVEL
// ---------------------------
let currentDisplayList: UserClass[] = [...userList];

// ---------------------------
// RENDER USERS
// ---------------------------
function renderUsers(list: UserClass[]): void {
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        updateStats(list);
        return;
    }

    const userModal = document.getElementById("user-modal") as HTMLDivElement;
    const modalDetails = document.getElementById("modal-details") as HTMLDivElement;
    const modalClose = document.getElementById("modal-close") as HTMLSpanElement;

    modalClose.onclick = () => { userModal.style.display = "none"; };
    window.onclick = (e: MouseEvent) => { if (e.target === userModal) userModal.style.display = "none"; };

    list.forEach(user => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        const avatarContent = user.photo
            ? `<img src="${user.photo}" class="user-photo" alt="${user.name}">`
            : `<div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>`;

        userCard.innerHTML = `
            ${avatarContent}
            <h3>${user.name}</h3>
            <p class="tasks">${0} tasks</p>
        `;

        // BOTÕES CARD
        const cardButtons = document.createElement("div");
        cardButtons.classList.add("card-buttons");

        const btnToggle = document.createElement("button");
        btnToggle.textContent = user.active ? "Desativar" : "Ativar";
        btnToggle.classList.add(user.active ? "active" : "inactive");
        btnToggle.addEventListener("click", e => {
            e.stopPropagation();
            user.toggleActive();
            currentDisplayList = currentDisplayList.map(u => u.id === user.id ? user : u);
            renderUsers(currentDisplayList);
        });

        const btnRemove = document.createElement("button");
        btnRemove.textContent = "Remover";
        btnRemove.classList.add("remove");
        btnRemove.addEventListener("click", e => {
            e.stopPropagation();
            userList = userList.filter(u => u.id !== user.id);
            currentDisplayList = currentDisplayList.filter(u => u.id !== user.id);
            renderUsers(currentDisplayList);
        });

        cardButtons.append(btnToggle, btnRemove);
        userCard.appendChild(cardButtons);

        // MODAL
        userCard.addEventListener("click", () => {
            const statusClass = user.active ? "active" : "inactive";
            const statusText = user.active ? "Active" : "Inactive";

            modalDetails.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Nome:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                <p><strong>Tarefas atribuídas:</strong> ${0}</p>
            `;
            userModal.style.display = "block";
        });

        container.appendChild(userCard);
    });

    updateStats(list);
}

// ---------------------------
// FORM
// ---------------------------
const form = document.createElement("form");
form.classList.add("form");

const nameInput = document.createElement("input") as HTMLInputElement;
nameInput.type = "text";
nameInput.placeholder = "First and last name";
nameInput.required = true;

const emailInput = document.createElement("input") as HTMLInputElement;
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true;

const photoInput = document.createElement("input") as HTMLInputElement;
photoInput.type = "file";
photoInput.accept = "image/*";

const btnAdd = document.createElement("button");
btnAdd.type = "submit";
btnAdd.textContent = "New user";
btnAdd.classList.add("btn-add");

// BOTÕES FILTRO/SORT
let sortAsc: boolean = true;

const btnSortByName = document.createElement("button");
btnSortByName.type = "button";
btnSortByName.textContent = "Ordenar A-Z";
btnSortByName.classList.add("btn-filter");

btnSortByName.addEventListener("click", () => {
    currentDisplayList.sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    renderUsers(currentDisplayList);
    btnSortByName.textContent = sortAsc ? "Ordenar Z-A" : "Ordenar A-Z";
    sortAsc = !sortAsc;
});

const btnShowAll = document.createElement("button");
btnShowAll.type = "button";
btnShowAll.textContent = "Show all";
btnShowAll.classList.add("btn-filter");
btnShowAll.addEventListener("click", () => {
    currentDisplayList = [...userList];
    renderUsers(currentDisplayList);
});

const btnShowActive = document.createElement("button");
btnShowActive.type = "button";
btnShowActive.textContent = "Show active only";
btnShowActive.classList.add("btn-filter");
btnShowActive.addEventListener("click", () => {
    currentDisplayList = userList.filter(u => u.active);
    renderUsers(currentDisplayList);
});

const btnShowInactive = document.createElement("button");
btnShowInactive.type = "button";
btnShowInactive.textContent = "Show inactive only";
btnShowInactive.classList.add("btn-filter");
btnShowInactive.addEventListener("click", () => {
    currentDisplayList = userList.filter(u => !u.active);
    renderUsers(currentDisplayList);
});

// APPEND FORM
const inputContainer = document.createElement("div");
inputContainer.classList.add("input-container");
inputContainer.append(nameInput, emailInput, photoInput, btnAdd);

const filterContainer = document.createElement("div");
filterContainer.classList.add("filter-buttons");
filterContainer.append(btnShowAll, btnShowActive, btnShowInactive, btnSortByName);

form.append(inputContainer, filterContainer);
formContainer.prepend(form);

// EVENTOS FORM
form.addEventListener("submit", e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    let photoURL: string | undefined;
    if (photoInput.files && photoInput.files[0]) {
        photoURL = URL.createObjectURL(photoInput.files[0]);
    }

    userList.push(new UserClass(Date.now(), name, email, photoURL));
    currentDisplayList = [...userList];
    renderUsers(currentDisplayList);

    nameInput.value = "";
    emailInput.value = "";
    photoInput.value = "";
});

// SEARCH
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    currentDisplayList = userList.filter(u => u.name.toLowerCase().includes(term));
    renderUsers(currentDisplayList);
});

// INITIAL RENDER
renderUsers(currentDisplayList);
