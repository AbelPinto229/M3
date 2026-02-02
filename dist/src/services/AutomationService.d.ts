import { User } from '../models/Users';
import { Task } from "../models/Task";
import { AssignmentService } from './AssignmentService.js';
import { DeadlineService } from './DeadlineService.js';
import { PriorityService } from './PriorityService.js';
export declare class AutomationRulesService {
    private assignmentService;
    private deadlineService;
    private priorityService;
    constructor(assignmentService: AssignmentService, deadlineService: DeadlineService, priorityService: PriorityService);
    applyRules(task: Task): void;
    applyUserRules(user: User): void;
    private ruleTaskCompleted;
    private ruleTaskBlocked;
    private ruleTaskExpired;
    private ruleCheckAllExpiredTasks;
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
