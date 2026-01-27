import { User } from '../models/Users';
import { Task } from "../models/task";
export declare class BackupService {
    private users;
    private tasks;
    private assignments;
    constructor(users: User[], tasks: Task[], assignments: any);
    exportUsers(): User[];
    exportTasks(): Task[];
    exportAssignments(): any;
    exportAll(): {
        users: User[];
        tasks: Task[];
        assignments: any;
    };
}
