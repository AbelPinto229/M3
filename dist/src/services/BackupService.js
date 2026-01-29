// BACKUP SERVICE - Creates and manages data backups with timestamps
export class BackupService {
    users;
    tasks;
    assignments;
    // Array storing all created backups
    backups = [];
    constructor(users, tasks, assignments) {
        this.users = users;
        this.tasks = tasks;
        this.assignments = assignments;
    }
    // Exports a shallow copy of all users
    exportUsers() { return [...this.users]; }
    // Exports a shallow copy of all tasks
    exportTasks() { return [...this.tasks]; }
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
    // Creates a new backup with current timestamp and stores it
    createBackup() {
        const backup = {
            timestamp: new Date(),
            users: this.exportUsers(),
            tasks: this.exportTasks(),
            assignments: this.exportAssignments()
        };
        this.backups.push(backup);
        return backup;
    }
    // Retrieves a copy of all stored backups
    getBackups() {
        return [...this.backups];
    }
    // Retrieves the most recent backup or undefined if no backups exist
    getLastBackup() {
        return this.backups[this.backups.length - 1];
    }
    // Clears all stored backups
    clearBackups() {
        this.backups = [];
    }
}
//# sourceMappingURL=BackupService.js.map