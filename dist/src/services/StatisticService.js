import { TaskStatus } from '../tasks/TaskStatus.js';
// STATISTICS SERVICE - Calculates and provides analytics for tasks and users
export class StatisticsService {
    tasks;
    users;
    constructor(tasks, users) {
        this.tasks = tasks;
        this.users = users;
    }
    // Returns total count of users
    countUsers() { return this.users.length; }
    // Returns total count of tasks
    countTasks() { return this.tasks.length; }
    // Returns count of completed tasks
    countCompletedTasks() { return this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length; }
    // Returns count of active (non-completed) tasks
    countActiveTasks() { return this.tasks.filter(t => t.status !== TaskStatus.COMPLETED).length; }
    // Counts tasks grouped by their status
    tasksByStatus() {
        const result = {};
        this.tasks.forEach(t => result[t.status] = (result[t.status] || 0) + 1);
        return result;
    }
    // Calculates comprehensive task statistics including completion rate and status breakdown
    calculateTaskStats() {
        const total = this.tasks.length;
        const completed = this.countCompletedTasks();
        const pending = this.countActiveTasks();
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        const byStatus = this.tasksByStatus();
        return { total, completed, pending, completionRate, byStatus };
    }
    // Calculates comprehensive user statistics including active/inactive rates
    calculateUserStats() {
        const total = this.users.length;
        const active = this.users.filter(u => u.active).length;
        const inactive = total - active;
        const activeRate = total === 0 ? 0 : Math.round((active / total) * 100);
        return { total, active, inactive, activeRate };
    }
}
//# sourceMappingURL=StatisticService.js.map