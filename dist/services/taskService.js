import { TaskClass } from "../models/task.js";
// ===============================
// STATE
// ===============================
export let taskList = [];
let nextTaskID = 1;
// ===============================
// NEXT ID
// ===============================
export function getNextTaskID() {
    return nextTaskID++;
}
// ===============================
// CRUD
// ===============================
export function addTask(task) {
    taskList.push(task);
}
export function removeTask(id) {
    taskList = taskList.filter(t => t.id !== id);
}
export function getAllTasks() {
    return [...taskList];
}
// ===============================
// LOAD INITIAL TASKS
// ===============================
export function loadInitialTasks() {
    const initialData = [
        { title: "Review class 2 slides", category: "Study" },
        { title: "Do guided exercises", category: "Study" },
        { title: "Do autonomous exercises", category: "Study" }
    ];
    initialData.forEach(data => {
        taskList.push(new TaskClass(nextTaskID++, data.title, data.category));
    });
    return [...taskList]; // retorna lista inicial
}
