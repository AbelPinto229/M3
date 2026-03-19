import { TaskService } from './TaskService.js';
import { UserService } from './UserService.js';
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
    private taskService;
    private userService;
    constructor(taskService: TaskService, userService: UserService);
    countUsers(): UserStats;
    countTasks(): TaskStats;
    countCompletedTasks(): number;
    countActiveTasks(): number;
    tasksByStatus(): Record<string, number>;
}
