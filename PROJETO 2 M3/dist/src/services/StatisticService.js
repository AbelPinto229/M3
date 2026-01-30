import { TaskStatus } from '../tasks/TaskStatus.js';
// STATISTICS SERVICE - Calculates and provides analytics for tasks and users
export class StatisticsService {
    tasks;
    users;
    constructor(tasks, users) {
        this.tasks = tasks;
        this.users = users;
    }
    // Returns total count of users and user statistics
    countUsers() {
        const total = this.users.length;
        const active = this.users.filter(u => u.active).length;
        const inactive = total - active;
        const activeRate = total === 0 ? 0 : Math.round((active / total) * 100);
        return { total, active, inactive, activeRate };
    }
    // Returns total count of tasks and task statistics
    countTasks() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
        const pending = this.tasks.filter(t => t.status !== TaskStatus.COMPLETED).length;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        const byStatus = this.tasksByStatus();
        return { total, completed, pending, completionRate, byStatus };
    }
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
}
//# sourceMappingURL=StatisticService.js.map