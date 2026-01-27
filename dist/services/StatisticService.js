"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
class StatisticsService {
    tasks;
    users;
    constructor(tasks, users) {
        this.tasks = tasks;
        this.users = users;
    }
    countUsers() { return this.users.length; }
    countTasks() { return this.tasks.length; }
    countCompletedTasks() { return this.tasks.filter(t => t.status === 'Concluído').length; }
    countActiveTasks() { return this.tasks.filter(t => t.status !== 'Concluído').length; }
    tasksByStatus() {
        const result = {};
        this.tasks.forEach(t => result[t.status] = (result[t.status] || 0) + 1);
        return result;
    }
}
exports.StatisticsService = StatisticsService;
//# sourceMappingURL=StatisticService.js.map