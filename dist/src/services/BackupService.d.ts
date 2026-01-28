import { User } from '../models/Users';
import { Task } from '../models/Task';
export interface BackupData {
    timestamp: Date;
    users: User[];
    tasks: Task[];
    assignments: any;
}
export declare class BackupService {
    private users;
    private tasks;
    private assignments;
    private backups;
    constructor(users: User[], tasks: Task[], assignments: any);
    exportUsers(): User[];
    exportTasks(): Task[];
    exportAssignments(): any;
    exportAll(): {
        users: User[];
        tasks: Task[];
        assignments: any;
    };
    createBackup(): BackupData;
    getBackups(): BackupData[];
    getLastBackup(): BackupData | undefined;
    clearBackups(): void;
}
