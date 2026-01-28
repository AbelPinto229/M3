import { ExtendedTask } from './TaskService.js';
export declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare class PriorityService {
    private priorities;
    setPriority(taskId: number, priority: Priority): void;
    getPriority(taskId: number): Priority | undefined;
    getHighPriorityTasks(): number[];
    getTasksByPriority(tasks: ExtendedTask[], priority: string): ExtendedTask[];
    getPriorities(): string[];
    sortTasksByPriority(tasks: ExtendedTask[]): ExtendedTask[];
}
