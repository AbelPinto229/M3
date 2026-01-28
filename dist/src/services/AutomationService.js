import { TaskStatus } from '../tasks/TaskStatus.js';
export class AutomationRulesService {
    assignmentService;
    deadlineService;
    constructor(assignmentService, deadlineService) {
        this.assignmentService = assignmentService;
        this.deadlineService = deadlineService;
    }
    // Apply all rules for a task
    applyRules(task) {
        this.ruleTaskCompleted(task);
        this.ruleTaskBlocked(task);
        this.ruleTaskExpired(task);
    }
    // Apply all rules for a user
    applyUserRules(user) {
        this.ruleUserInactive(user);
    }
    // Rules - Business logic
    // Task completed: log the event
    ruleTaskCompleted(task) {
        if (task.status === TaskStatus.COMPLETED) {
            console.log(`LOG: Task "${task.title}" has been completed.`);
        }
    }
    // Task blocked: notify about it
    ruleTaskBlocked(task) {
        if (task.status === 'Bloqueada') {
            console.log(`NOTIFICATION: Task "${task.title}" is blocked.`);
        }
    }
    // Task expired: auto-block it
    ruleTaskExpired(task) {
        if (this.deadlineService.isExpired(task.id) && task.status !== TaskStatus.COMPLETED) {
            task.status = 'Bloqueada';
            console.log(`RULE: Task "${task.title}" expired and was blocked.`);
        }
    }
    // User inactive: remove assignments
    ruleUserInactive(user) {
        if (!user.active) {
            const tasks = this.assignmentService.getTasksFromUser(user.id);
            tasks.forEach(taskId => this.assignmentService.unassignUser(taskId, user.id));
            console.log(`RULE: Inactive user "${user.email}", assignments removed.`);
        }
    }
}
export class BackupService {
    users;
    tasks;
    assignments;
    constructor(users, tasks, assignments) {
        this.users = users;
        this.tasks = tasks;
        this.assignments = assignments;
    }
    exportUsers() { return [...this.users]; }
    exportTasks() { return [...this.tasks]; }
    exportAssignments() { return { ...this.assignments }; }
    exportAll() {
        return {
            users: this.exportUsers(),
            tasks: this.exportTasks(),
            assignments: this.exportAssignments()
        };
    }
}
//# sourceMappingURL=AutomationService.js.map