import { TaskStatus } from '../tasks/TaskStatus.js';
export class StatisticsService {
    tasks;
    users;
    constructor(tasks, users) {
        this.tasks = tasks;
        this.users = users;
    }
    countUsers() { return this.users.length; }
    countTasks() { return this.tasks.length; }
    countCompletedTasks() { return this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length; }
    countActiveTasks() { return this.tasks.filter(t => t.status !== TaskStatus.COMPLETED).length; }
    tasksByStatus() {
        const result = {};
        this.tasks.forEach(t => result[t.status] = (result[t.status] || 0) + 1);
        return result;
    }
    calculateTaskStats() {
        const total = this.tasks.length;
        const completed = this.countCompletedTasks();
        const pending = this.countActiveTasks();
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        const byStatus = this.tasksByStatus();
        return { total, completed, pending, completionRate, byStatus };
    }
    calculateUserStats() {
        const total = this.users.length;
        const active = this.users.filter(u => u.active).length;
        const inactive = total - active;
        const activeRate = total === 0 ? 0 : Math.round((active / total) * 100);
        return { total, active, inactive, activeRate };
    }
}
//# sourceMappingURL=StatisticService.js.map