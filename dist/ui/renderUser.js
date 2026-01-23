import { UserClass } from "../models/user.js";
import { addUser, getAllUsers, removeUser } from "../services/userService.js";
// ===========================
// RENDER FORM
// ===========================
export function renderUserForm() {
    const formContainer = document.getElementById("form");
    if (!formContainer)
        return;
    // evita duplicar o form
    if (formContainer.children.length > 0)
        return;
    const form = document.createElement("form");
    form.classList.add("form");
    const nameInput = document.createElement("input");
    nameInput.placeholder = "First and last name";
    nameInput.required = true;
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "example@mail.com";
    emailInput.required = true;
    const btnAdd = document.createElement("button");
    btnAdd.type = "submit";
    btnAdd.textContent = "New user";
    btnAdd.classList.add("btn-add");
    form.append(nameInput, emailInput, btnAdd);
    formContainer.appendChild(form);
    // SUBMIT
    form.addEventListener("submit", e => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        if (!name || !email)
            return;
        addUser(new UserClass(Date.now(), name, email));
        renderUsers(getAllUsers());
        nameInput.value = "";
        emailInput.value = "";
    });
}
// ===========================
// STATS
// ===========================
function updateStats(list) {
    const totalUsersSpan = document.getElementById('total-users');
    const activeUsersSpan = document.getElementById('active-users');
    const inactiveUsersSpan = document.getElementById('inactive-users');
    const total = list.length;
    const active = list.filter(u => u.active).length;
    const inactive = total - active;
    const activePercent = total === 0 ? 0 : Math.round((active / total) * 100);
    const inactivePercent = total === 0 ? 0 : Math.round((inactive / total) * 100);
    totalUsersSpan.textContent = `${total}`;
    activeUsersSpan.textContent = `${active} (${activePercent}%)`;
    inactiveUsersSpan.textContent = `${inactive} (${inactivePercent}%)`;
}
// ===========================
// RENDER USERS
// ===========================
export function renderUsers(list) {
    const container = document.getElementById('user-list');
    if (!container)
        return;
    container.innerHTML = "";
    if (list.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        updateStats(list);
        return;
    }
    const userModal = document.getElementById('user-modal');
    const modalClose = document.getElementById('modal-close');
    modalClose.onclick = () => userModal.style.display = "none";
    window.onclick = e => {
        if (e.target === userModal)
            userModal.style.display = "none";
    };
    list.forEach(user => {
        const userCard = document.createElement("div");
        userCard.className = "user-card";
        const avatar = user.photo
            ? `<img src="${user.photo}" class="user-photo">`
            : `<div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>`;
        userCard.innerHTML = `
            ${avatar}
            <h3>${user.name}</h3>
            <p class="tasks">0 tasks</p>
            <p class="tasks-concluded">0 tasks concluded</p>
        `;
        const btnToggle = document.createElement("button");
        btnToggle.textContent = user.active ? "Deactivate" : "Activate";
        btnToggle.className = user.active ? "active" : "inactive";
        btnToggle.onclick = e => {
            e.stopPropagation();
            user.toggleActive();
            renderUsers(getAllUsers());
        };
        const btnRemove = document.createElement("button");
        btnRemove.textContent = "Remove";
        btnRemove.className = "remove";
        btnRemove.onclick = e => {
            e.stopPropagation();
            removeUser(user.id);
            renderUsers(getAllUsers());
        };
        const btns = document.createElement("div");
        btns.className = "card-buttons";
        btns.append(btnToggle, btnRemove);
        userCard.appendChild(btns);
        userCard.onclick = () => {
            const modalDetails = document.getElementById("modal-details");
            modalDetails.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
            `;
            userModal.style.display = "block";
        };
        container.appendChild(userCard);
    });
    updateStats(list);
}
