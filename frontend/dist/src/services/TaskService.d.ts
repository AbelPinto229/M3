import { Task } from '../models/Task.js';
export interface ExtendedTask extends Task {
    priority?: string;
    deadline?: string;
    assigned?: string[];
}
export declare class TaskService {
    private tasks;
    private nextId;
    getTasks(): ExtendedTask[];
    getTaskById(id: number): ExtendedTask | undefined;
    getTasksByStatus(status: string): ExtendedTask[];
    addTask(title: string, type: string, deadline?: string): ExtendedTask;
    updateTaskStatus(id: number, status: string): void;
    updateTaskTitle(id: number, title: string): void;
    updateTaskPriority(id: number, priority: string): void;
    updateTaskDeadline(id: number, deadline: string): void;
    assignUser(taskId: number, email: string): void;
    unassignUser(taskId: number, email: string): void;
    deleteTask(id: number): void;
}
