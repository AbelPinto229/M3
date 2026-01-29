import { TaskStatus } from '../tasks/TaskStatus.js';
export class AutomationRulesService {
    assignmentService;
    deadlineService;
    priorityService;
    constructor(assignmentService, deadlineService, priorityService) {
        this.assignmentService = assignmentService;
        this.deadlineService = deadlineService;
        this.priorityService = priorityService;
    }
    // Applies all automation rules to a task (completion, blocked, expiration checks)
    applyRules(task) {
        this.ruleTaskCompleted(task);
        this.ruleTaskBlocked(task);
        this.ruleTaskExpired(task);
        this.ruleCheckAllExpiredTasks();
    }
    // Applies all automation rules to a user (inactive status check)
    applyUserRules(user) {
        this.ruleUserInactive(user);
    }
    // Rules - Business logic
    // Rule: Task completed - logs completion event
    ruleTaskCompleted(task) {
        if (task.status === TaskStatus.COMPLETED) {
            console.log(`LOG: Task "${task.title}" has been completed.`);
        }
    }
    // Rule: Task blocked - notifies about blocked status
    ruleTaskBlocked(task) {
        if (task.status === 'BLOCKED') {
            console.log(`NOTIFICATION: Task "${task.title}" is blocked.`);
        }
    }
    // Rule: Task expired - auto-blocks expired tasks that are not completed
    ruleTaskExpired(task) {
        if (this.deadlineService.isExpired(task.id) && task.status !== TaskStatus.COMPLETED) {
            task.status = 'BLOCKED';
            console.log(`RULE: Task "${task.title}" expired and was blocked.`);
        }
    }
    // Rule: Check all expired tasks periodically
    ruleCheckAllExpiredTasks() {
        const expiredTasks = this.deadlineService.getExpiredTasks();
        const highPriorityTasks = this.priorityService.getHighPriorityTasks();
        if (expiredTasks.length > 0) {
            console.log(`RULE: ${expiredTasks.length} task(s) have expired deadlines.`);
        }
        if (highPriorityTasks.length > 0) {
            console.log(`RULE: ${highPriorityTasks.length} high-priority task(s) detected.`);
        }
    }
    // Rule: User inactive - removes all task assignments from inactive users
    ruleUserInactive(user) {
        if (!user.active) {
            const tasks = this.assignmentService.getTasksFromUser(user.id);
            tasks.forEach(taskId => this.assignmentService.unassignUser(taskId, user.id));
            console.log(`RULE: Inactive user "${user.email}", assignments removed.`);
        }
    }
}
// BACKUP SERVICE - Exports and manages data backups
export class BackupService {
    users;
    tasks;
    assignments;
    constructor(users, tasks, assignments) {
        this.users = users;
        this.tasks = tasks;
        this.assignments = assignments;
    }
    // Exports a copy of all users
    exportUsers() { return [...this.users]; }
    // Exports a copy of all tasks
    exportTasks() { return [...this.tasks]; }
    // Exports a copy of all assignments
    exportAssignments() { return { ...this.assignments }; }
    // Exports all data (users, tasks, assignments) as a backup object
    exportAll() {
        return {
            users: this.exportUsers(),
            tasks: this.exportTasks(),
            assignments: this.exportAssignments()
        };
    }
}
//# sourceMappingURL=AutomationService.js.map