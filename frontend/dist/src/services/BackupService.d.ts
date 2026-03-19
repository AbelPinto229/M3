import { User } from '../models/Users';
import { Task } from '../models/Task';
import { UserService } from './UserService.js';
import { TaskService } from './TaskService.js';
export interface BackupData {
    timestamp: Date;
    users: User[];
    tasks: Task[];
    assignments: any;
}
export declare class BackupService {
    private userService;
    private taskService;
    private assignments;
    private backups;
    constructor(userService: UserService, taskService: TaskService, assignments: any);
    exportUsers(): User[];
    exportTasks(): import("./TaskService.js").ExtendedTask[];
    exportAssignments(): any;
    exportAll(): {
        users: User[];
        tasks: import("./TaskService.js").ExtendedTask[];
        assignments: any;
    };
}
