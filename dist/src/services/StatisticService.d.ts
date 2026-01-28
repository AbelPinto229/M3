import { Task } from '../models/Task';
import { User } from '../models/Users';
export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
    byStatus: Record<string, number>;
}
export interface UserStats {
    total: number;
    active: number;
    inactive: number;
    activeRate: number;
}
export declare class StatisticsService {
    private tasks;
    private users;
    constructor(tasks: Task[], users: User[]);
    countUsers(): number;
    countTasks(): number;
    countCompletedTasks(): number;
    countActiveTasks(): number;
    tasksByStatus(): Record<string, number>;
    calculateTaskStats(): TaskStats;
    calculateUserStats(): UserStats;
}
