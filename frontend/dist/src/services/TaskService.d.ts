import { Task } from '../models/Task.js';
export interface ExtendedTask extends Task {
    priority?: string;
    deadline?: string;
    assigned?: string[];
}
export declare class TaskService {
    private API_BASE_URL;
    private tasks;
    loadTasks(): Promise<void>;
    getTasks(): ExtendedTask[];
    getTaskById(id: number): ExtendedTask | undefined;
    getTasksByStatus(status: string): ExtendedTask[];
    addTask(title: string, type: string, deadline?: string): Promise<ExtendedTask>;
    updateTaskStatus(id: number, status: string): Promise<void>;
    updateTaskTitle(id: number, title: string): Promise<void>;
    updateTaskPriority(id: number, priority: string): Promise<void>;
    updateTaskDeadline(id: number, deadline: string): Promise<void>;
    assignUser(taskId: number, email: string): Promise<void>;
    unassignUser(taskId: number, email: string): Promise<void>;
    deleteTask(id: number): Promise<void>;
}
