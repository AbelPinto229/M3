"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
class BackupService {
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
exports.BackupService = BackupService;
//# sourceMappingURL=AutomationService.js.map