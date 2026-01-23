import { TaskClass } from "../models/task.js";
let taskList = [];
export const addTask = (title, category) => {
    const id = Date.now();
    const task = new TaskClass(id, title, category);
    taskList.push(task);
};
export const removeTask = (id) => {
    taskList = taskList.filter(t => t.id !== id);
};
export const getAllTasks = () => [...taskList];
export const clearCompletedTasks = () => {
    taskList = taskList.filter(t => !t.concluded);
};
export const searchTasks = (term) => {
    return taskList.filter(t => t.title.toLowerCase().includes(term.toLowerCase()));
};
