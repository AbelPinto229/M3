import { TaskClass, TaskCategory } from "../models/task.js";

// ===============================
// STATE
// ===============================
export let taskList: TaskClass[] = [];
let nextTaskID = 1;

// ===============================
// NEXT ID
// ===============================
export function getNextTaskID(): number {
    return nextTaskID++;
}

// ===============================
// CRUD
// ===============================
export function addTask(task: TaskClass): void {
    taskList.push(task);
}

export function removeTask(id: number): void {
    taskList = taskList.filter(t => t.id !== id);
}

export function getAllTasks(): TaskClass[] {
    return [...taskList];
}

// ===============================
// LOAD INITIAL TASKS
// ===============================
export function loadInitialTasks(): TaskClass[] {  
    const initialData: { title: string; category: TaskCategory }[] = [
        { title: "Review class 2 slides", category: "Study" },
        { title: "Do guided exercises", category: "Study" },
        { title: "Do autonomous exercises", category: "Study" }
    ];

    initialData.forEach(data => {
        taskList.push(new TaskClass(nextTaskID++, data.title, data.category));
    });

    return [...taskList];  
}
