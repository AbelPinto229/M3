// BACKUP SERVICE - Creates and manages data backups with timestamps
export class BackupService {
    userService;
    taskService;
    assignments;
    // Array storing all created backups
    backups = [];
    constructor(userService, taskService, assignments) {
        this.userService = userService;
        this.taskService = taskService;
        this.assignments = assignments;
    }
    // Exports a shallow copy of all users
    exportUsers() { return [...this.userService.getUsers()]; }
    // Exports a shallow copy of all tasks
    exportTasks() { return [...this.taskService.getTasks()]; }
    // Exports a shallow copy of all assignments
    exportAssignments() { return { ...this.assignments }; }
    // Exports all data (users, tasks, assignments) in a single object
    exportAll() {
        return {
            users: this.exportUsers(),
            tasks: this.exportTasks(),
            assignments: this.exportAssignments()
        };
    }
}
//# sourceMappingURL=BackupService.js.map