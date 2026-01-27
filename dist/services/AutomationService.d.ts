import { User } from '../models/Users';
import { Task } from "../models/ask";
import { AssignmentService } from './AssignmentService.js';
import { DeadlineService } from './DeadlineService.js';
export declare class AutomationRulesService {
    private assignmentService;
    private deadlineService;
    constructor(assignmentService: AssignmentService, deadlineService: DeadlineService);
    applyRules(task: Task): void;
    applyUserRules(user: User): void;
    private ruleTaskCompleted;
    private ruleTaskBlocked;
    private ruleTaskExpired;
    private ruleUserInactive;
}
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
