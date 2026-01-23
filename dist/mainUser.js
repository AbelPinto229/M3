// mainUser.ts
import { UserClass } from "./models/user.js";
import { addUser, getAllUsers, loadInitialUsers } from "./services/userService.js";
import { renderUsers, renderUserForm } from "./ui/renderUser.js";
window.addEventListener("DOMContentLoaded", () => {
    loadInitialUsers();
    addUser(new UserClass(999, "Alice Extra", "alice@example.com"));
    renderUserForm();
    renderUsers(getAllUsers());
});
