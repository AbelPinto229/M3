"use strict";
//Sistema de atribuição de tarefas a utilizadores
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUser = assignUser;
exports.unassignUser = unassignUser;
exports.getUsersFromTask = getUsersFromTask;
exports.getTasksFromUser = getTasksFromUser;
const taskToUsers = new Map();
const userToTasks = new Map();
function assignUser(taskID, userID) {
    // Adiciona user à task
    if (!taskToUsers.has(taskID)) {
        taskToUsers.set(taskID, new Set());
    }
    taskToUsers.get(taskID).add(userID);
    // Adiciona task ao user
    if (!userToTasks.has(userID)) {
        userToTasks.set(userID, new Set());
    }
    userToTasks.get(userID).add(taskID);
}
function unassignUser(taskID, userID) {
    // Remove user da task
    taskToUsers.get(taskID)?.delete(userID);
    // Remove task do user
    userToTasks.get(userID)?.delete(taskID);
}
function getUsersFromTask(taskID) {
    const users = taskToUsers.get(taskID);
    return users ? Array.from(users) : [];
}
function getTasksFromUser(userID) {
    const tasks = userToTasks.get(userID);
    return tasks ? Array.from(tasks) : [];
}
//# sourceMappingURL=AssignmentService.js.map