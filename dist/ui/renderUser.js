import { UserClass } from "../models/user.js";
import { addUser, getAllUsers, removeUser, getNextID } from "../services/userService.js";
// ---------------------------
// STATE LOCAL
// ---------------------------
let currentDisplayList = [];
// ---------------------------
// STATISTICS
// ---------------------------
function updateStats(list) {
    const totalUsers = document.getElementById("total-users");
    const activeUsers = document.getElementById("active-users");
    const inactiveUsers = document.getElementById("inactive-users");
    const total = list.length;
    const active = list.filter(u => u.active).length;
    const inactive = total - active;
    const activePercent = total === 0 ? 0 : Math.round((active / total) * 100);
    const inactivePercent = total === 0 ? 0 : Math.round((inactive / total) * 100);
    totalUsers.textContent = `${total}`;
    activeUsers.textContent = `${active} (${activePercent}%)`;
    inactiveUsers.textContent = `${inactive} (${inactivePercent}%)`;
}
// ---------------------------
// RENDER USERS
// ---------------------------
export function renderUsers(list) {
    const container = document.getElementById("user-list");
    if (!container)
        return;
    container.innerHTML = "";
    currentDisplayList = list;
    const userModal = document.getElementById("user-modal");
    const modalClose = document.getElementById("modal-close");
    modalClose.onclick = () => { userModal.style.display = "none"; };
    window.onclick = e => { if (e.target === userModal)
        userModal.style.display = "none"; };
    if (list.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        updateStats(list);
        return;
    }
    list.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";
        const avatar = user.photo
            ? `<img src="${user.photo}" class="user-photo" alt="${user.name}">`
            : `<div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>`;
        card.innerHTML = `
            ${avatar}
            <h3>${user.name}</h3>
            <p class="tasks">0 tasks</p>
            <p class="tasks-concluded">0 tasks concluded</p>
        `;
        // Buttons
        const btnToggle = document.createElement("button");
        btnToggle.textContent = user.active ? "Deactivate" : "Activate";
        btnToggle.className = user.active ? "active" : "inactive";
        btnToggle.onclick = e => {
            e.stopPropagation();
            user.toggleActive();
            renderUsers(currentDisplayList);
        };
        const btnRemove = document.createElement("button");
        btnRemove.textContent = "Remove";
        btnRemove.className = "remove";
        btnRemove.onclick = e => {
            e.stopPropagation();
            removeUser(user.id);
            currentDisplayList = currentDisplayList.filter(u => u.id !== user.id);
            renderUsers(currentDisplayList);
        };
        const btns = document.createElement("div");
        btns.className = "card-buttons";
        btns.append(btnToggle, btnRemove);
        card.appendChild(btns);
        // Modal detalhado
        card.onclick = () => {
            const modalDetails = document.getElementById("modal-details");
            const statusClass = user.active ? "active" : "inactive";
            const statusText = user.active ? "Active" : "Inactive";
            modalDetails.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                <p><strong>Assigned tasks:</strong> 0</p>
                <p><strong>Completed tasks:</strong> 0</p>
            `;
            userModal.style.display = "block";
        };
        container.appendChild(card);
    });
    updateStats(list);
}
// ---------------------------
// RENDER FORM + FILTER + SEARCH
// ---------------------------
export function renderUserForm() {
    const formContainer = document.getElementById("form");
    if (!formContainer)
        return;
    if (formContainer.children.length > 0)
        return;
    const form = document.createElement("form");
    form.classList.add("form");
    // Inputs
    const nameInput = document.createElement("input");
    nameInput.placeholder = "First and last name";
    nameInput.required = true;
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "example@mail.com";
    emailInput.required = true;
    const photoInput = document.createElement("input");
    photoInput.type = "file";
    photoInput.accept = "image/*";
    const btnAdd = document.createElement("button");
    btnAdd.type = "submit";
    btnAdd.textContent = "New user";
    btnAdd.classList.add("btn-add");
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");
    inputContainer.append(nameInput, emailInput, photoInput, btnAdd);
    // Filters
    const btnSort = document.createElement("button");
    let sortAsc = true;
    btnSort.type = "button";
    btnSort.textContent = "Sort A-Z";
    btnSort.classList.add("btn-filter");
    btnSort.addEventListener("click", () => {
        currentDisplayList.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        renderUsers(currentDisplayList);
        btnSort.textContent = sortAsc ? "Sort Z-A" : "Sort A-Z";
        sortAsc = !sortAsc;
    });
    const btnShowAll = document.createElement("button");
    btnShowAll.type = "button";
    btnShowAll.textContent = "Show all";
    btnShowAll.classList.add("btn-filter");
    btnShowAll.onclick = () => { currentDisplayList = getAllUsers(); renderUsers(currentDisplayList); };
    const btnShowActive = document.createElement("button");
    btnShowActive.type = "button";
    btnShowActive.textContent = "Show active only";
    btnShowActive.classList.add("btn-filter");
    btnShowActive.onclick = () => { currentDisplayList = getAllUsers().filter(u => u.active); renderUsers(currentDisplayList); };
    const btnShowInactive = document.createElement("button");
    btnShowInactive.type = "button";
    btnShowInactive.textContent = "Show inactive only";
    btnShowInactive.classList.add("btn-filter");
    btnShowInactive.onclick = () => { currentDisplayList = getAllUsers().filter(u => !u.active); renderUsers(currentDisplayList); };
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filter-buttons");
    filterContainer.append(btnShowAll, btnShowActive, btnShowInactive, btnSort);
    form.append(inputContainer, filterContainer);
    formContainer.appendChild(form);
    // Submit form
    form.onsubmit = e => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        let photo;
        if (photoInput.files && photoInput.files[0])
            photo = URL.createObjectURL(photoInput.files[0]);
        if (!name || !email)
            return;
        addUser(new UserClass(getNextID(), name, email, photo));
        currentDisplayList = getAllUsers();
        renderUsers(currentDisplayList);
        nameInput.value = "";
        emailInput.value = "";
        photoInput.value = "";
    };
    // Search
    const searchInput = document.getElementById("searchInput");
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", () => {
        const term = searchInput.value.trim().toLowerCase();
        currentDisplayList = getAllUsers().filter(u => u.name.toLowerCase().includes(term));
        renderUsers(currentDisplayList);
    });
}
