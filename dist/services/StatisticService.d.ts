import { Task } from '../models/Task';
import { User } from '../models/Users';
export declare class StatisticsService {
    private tasks;
    private users;
    constructor(tasks: Task[], users: User[]);
    countUsers(): number;
    countTasks(): number;
    countCompletedTasks(): number;
    countActiveTasks(): number;
    tasksByStatus(): Record<string, number>;
}
