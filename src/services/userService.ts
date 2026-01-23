import { UserClass } from "../models/user.js";

export let userList: UserClass[] = [];
let nextID = 1;

export function getNextID(): number {
    return nextID++;
}

export function addUser(user: UserClass): void {
    userList.push(user);
}

export function removeUser(id: number): void {
    userList = userList.filter(u => u.id !== id);
}

export function getAllUsers(): UserClass[] {
    return [...userList];
}

export function loadInitialUsers(): void {
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
