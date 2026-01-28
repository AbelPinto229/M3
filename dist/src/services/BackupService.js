export class BackupService {
    users;
    tasks;
    assignments;
    backups = [];
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
    getBackups() {
        return [...this.backups];
    }
    getLastBackup() {
        return this.backups[this.backups.length - 1];
    }
    clearBackups() {
        this.backups = [];
    }
}
//# sourceMappingURL=BackupService.js.map