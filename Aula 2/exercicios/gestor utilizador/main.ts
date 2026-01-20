// ---------------------------
// INTERFACE AND CLASS
// ---------------------------
// Exercise 1 — User Interface
interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    photo?: string;
}

// Exercise 2 — UserClass
class UserClass implements User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    photo?: string;

    constructor(id: number, name: string, email: string, photo?: string, active: boolean = true) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.photo = photo;
        this.active = active;
    }

    // Exercise 14 — Toggle Active/Inactive State
    toggleActive(): void {
        this.active = !this.active;
    }
}

// ---------------------------
// DATA
// ---------------------------
// Exercise 3 — Array of users
let userList: UserClass[] = [];
let nextID: number = 1;
let currentDisplayList: UserClass[] = [];

// ---------------------------
// CONTAINERS
// ---------------------------
const container = document.getElementById("user-list") as HTMLDivElement;
const formContainer = document.getElementById("form") as HTMLDivElement;

// ---------------------------
// STATISTICS
// ---------------------------
// Exercise 13 — Active / Inactive counters
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
// FUNCTION: LOAD INITIAL USERS
// ---------------------------
// Exercise 19 — Simulate initial user data
function loadInitialUsers(): void {
    const initialData = [
        { name: "Abel Pinto", email: "abel@example.com", active: true },
        { name: "Joel Pinto", email: "joel@example.com", active: false },
        { name: "Lionel Pinto", email: "Lionel@example.com", active: true },
        { name: "Isabel Pinto" , email: "Isabel@example.com", active: false },
        { name: "Ezequiel Pinto", email: "Ezequiel@example.com", active: true }
    ];

    initialData.forEach(data => {
        userList.push(new UserClass(nextID++, data.name, data.email, undefined, data.active));
    });

    currentDisplayList = [...userList];
}

// ---------------------------
// RENDER USERS
// ---------------------------
// Exercises 4, 5, 6, 7, 8, 10, 11, 12, 15, 17, 20
function renderUsers(list: UserClass[]): void {
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        updateStats(list);
        return;
    }

    const userModal = document.getElementById("user-modal") as HTMLDivElement;
    const modalClose = document.getElementById("modal-close") as HTMLSpanElement;

    // Modal close events — Exercise 17
    modalClose.onclick = () => { userModal.style.display = "none"; };
    window.onclick = (e: MouseEvent) => { if (e.target === userModal) userModal.style.display = "none"; };

    list.forEach(user => {
        const userCard = document.createElement("div") as HTMLDivElement;
        userCard.classList.add("user-card");

        const avatarContent = user.photo
            ? `<img src="${user.photo}" class="user-photo" alt="${user.name}">`
            : `<div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>`;

        userCard.innerHTML = `
            ${avatarContent}
            <h3>${user.name}</h3>
            <p class="tasks">0 tasks</p>
            <p class="tasks-concluded">0 tasks concluded</p>
        `;

        const cardButtons = document.createElement("div") as HTMLDivElement;
        cardButtons.classList.add("card-buttons");

        // Exercise 14 — Toggle Active/Inactive
        const btnToggle = document.createElement("button") as HTMLButtonElement;
        btnToggle.textContent = user.active ? "Deactivate" : "Activate";
        btnToggle.classList.add(user.active ? "active" : "inactive");
        btnToggle.addEventListener("click", e => {
            e.stopPropagation();
            user.toggleActive();
            renderUsers(currentDisplayList);
        });

        // Exercise 11 — Remove user
        const btnRemove = document.createElement("button") as HTMLButtonElement;
        btnRemove.textContent = "Remove";
        btnRemove.classList.add("remove");
        btnRemove.addEventListener("click", e => {
            e.stopPropagation();
            userList = userList.filter(u => u.id !== user.id);
            currentDisplayList = currentDisplayList.filter(u => u.id !== user.id);
            renderUsers(currentDisplayList);
        });

        cardButtons.append(btnToggle, btnRemove);
        userCard.appendChild(cardButtons);

        // Exercise 17 — Show user details in modal
        userCard.addEventListener("click", () => {
            const statusClass = user.active ? "active" : "inactive";
            const statusText = user.active ? "Active" : "Inactive";

            const modalDetails = document.getElementById("modal-details") as HTMLDivElement;
            modalDetails.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                <p><strong>Assigned tasks:</strong> 0</p>
                <p><strong>Completed tasks:</strong> 0</p>
            `;
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
const form = document.createElement("form");
form.classList.add("form");

// INPUTS
const nameInput = document.createElement("input") as HTMLInputElement;
nameInput.type = "text";
nameInput.placeholder = "First and last name";
nameInput.required = true;

const emailInput = document.createElement("input") as HTMLInputElement;
emailInput.type = "email";
emailInput.placeholder = "example@mail.com";
emailInput.required = true;

// PHOTO INPUT
const photoInput = document.createElement("input") as HTMLInputElement;
photoInput.type = "file";
photoInput.accept = "image/*";
photoInput.id = "photoInput";

const photoLabel = document.createElement("label") as HTMLLabelElement;
photoLabel.htmlFor = "photoInput";
photoLabel.textContent = "Profile photo:";

// ADD BUTTON
const btnAdd = document.createElement("button") as HTMLButtonElement;
btnAdd.type = "submit";
btnAdd.textContent = "New user";
btnAdd.classList.add("btn-add");

// INPUT CONTAINER
const inputContainer = document.createElement("div") as HTMLDivElement;
inputContainer.classList.add("input-container");
inputContainer.append(nameInput, emailInput, photoLabel, photoInput, btnAdd);

// ---------------------------
// FILTER BUTTONS
// ---------------------------
// Exercises 8, 15
let sortAsc = true;

const btnSortByName = document.createElement("button") as HTMLButtonElement;
btnSortByName.type = "button";
btnSortByName.textContent = "Sort A-Z";
btnSortByName.classList.add("btn-filter");
btnSortByName.addEventListener("click", () => {
    currentDisplayList.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    renderUsers(currentDisplayList);
    btnSortByName.textContent = sortAsc ? "Sort Z-A" : "Sort A-Z";
    sortAsc = !sortAsc;
});

const btnShowAll = document.createElement("button") as HTMLButtonElement;
btnShowAll.type = "button";
btnShowAll.textContent = "Show all";
btnShowAll.classList.add("btn-filter");
btnShowAll.addEventListener("click", () => {
    currentDisplayList = [...userList];
    renderUsers(currentDisplayList);
});

const btnShowActive = document.createElement("button") as HTMLButtonElement;
btnShowActive.type = "button";
btnShowActive.textContent = "Show active only";
btnShowActive.classList.add("btn-filter");
btnShowActive.addEventListener("click", () => {
    currentDisplayList = userList.filter(u => u.active);
    renderUsers(currentDisplayList);
});

const btnShowInactive = document.createElement("button") as HTMLButtonElement;
btnShowInactive.type = "button";
btnShowInactive.textContent = "Show inactive only";
btnShowInactive.classList.add("btn-filter");
btnShowInactive.addEventListener("click", () => {
    currentDisplayList = userList.filter(u => !u.active);
    renderUsers(currentDisplayList);
});

// FILTER CONTAINER
const filterContainer = document.createElement("div") as HTMLDivElement;
filterContainer.classList.add("filter-buttons");
filterContainer.append(btnShowAll, btnShowActive, btnShowInactive, btnSortByName);

// Append form to container
form.append(inputContainer, filterContainer);
formContainer.prepend(form);

// ---------------------------
// FORM SUBMIT
// ---------------------------
// Exercise 6, 16 — Add user
form.addEventListener("submit", e => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    let photoURL: string | undefined;

    if (photoInput.files && photoInput.files[0]) {
        photoURL = URL.createObjectURL(photoInput.files[0]);
    }

    const isValidEmail =
        email.includes("@") &&
        email.includes(".") &&
        email.indexOf(".") > email.indexOf("@");

    if (!name || !isValidEmail) return;

    userList.push(new UserClass(nextID++, name, email, photoURL));
    currentDisplayList = [...userList];
    renderUsers(currentDisplayList);

    nameInput.value = "";
    emailInput.value = "";
    photoInput.value = "";
});

// ---------------------------
// SEARCH
// ---------------------------
// Exercise 12 — Search by name
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    currentDisplayList = userList.filter(u => u.name.toLowerCase().includes(term));
    renderUsers(currentDisplayList);
});

// ---------------------------
// INITIALIZATION
// ---------------------------
// Exercise 19 — Load initial users
loadInitialUsers();
renderUsers(currentDisplayList);
