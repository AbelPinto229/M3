import { UserClass } from "../models/user.js";
// ---------------------------
// STATE
// ---------------------------
export let userList = [];
let nextID = 1;
// ---------------------------
// GET NEXT ID
// ---------------------------
export function getNextID() {
    return nextID++;
}
// ---------------------------
// CRUD
// ---------------------------
export function addUser(user) {
    userList.push(user);
}
export function removeUser(id) {
    userList = userList.filter(u => u.id !== id);
}
export function getAllUsers() {
    return [...userList];
}
// ---------------------------
// LOAD INITIAL USERS
// ---------------------------
export function loadInitialUsers() {
    const initialData = [
        { name: "Abel Pinto", email: "abel@example.com", active: true },
        { name: "Joel Pinto", email: "joel@example.com", active: false },
        { name: "Lionel Pinto", email: "lionel@example.com", active: true },
        { name: "Isabel Pinto", email: "isabel@example.com", active: false },
        { name: "Ezequiel Pinto", email: "ezequiel@example.com", active: true }
    ];
    initialData.forEach(data => {
        userList.push(new UserClass(nextID++, data.name, data.email, undefined, data.active));
    });
}
