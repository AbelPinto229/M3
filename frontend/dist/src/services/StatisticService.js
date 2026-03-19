import { TaskStatus } from '../tasks/TaskStatus.js';
// STATISTICS SERVICE - Calculates and provides analytics for tasks and users
export class StatisticsService {
    taskService;
    userService;
    constructor(taskService, userService) {
        this.taskService = taskService;
        this.userService = userService;
    }
    // Returns total count of users and user statistics
    countUsers() {
        const users = this.userService.getUsers();
        const total = users.length;
        const active = users.filter(u => u.active).length;
        const inactive = total - active;
        const activeRate = total === 0 ? 0 : Math.round((active / total) * 100);
        return { total, active, inactive, activeRate };
    }
    // Returns total count of tasks and task statistics
    countTasks() {
        const tasks = this.taskService.getTasks();
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
        const pending = tasks.filter(t => t.status !== TaskStatus.COMPLETED).length;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        const byStatus = this.tasksByStatus();
        return { total, completed, pending, completionRate, byStatus };
    }
    // Returns count of completed tasks
    countCompletedTasks() {
        const tasks = this.taskService.getTasks();
        return tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    }
    // Returns count of active (non-completed) tasks
    countActiveTasks() {
        const tasks = this.taskService.getTasks();
        return tasks.filter(t => t.status !== TaskStatus.COMPLETED).length;
    }
    // Counts tasks grouped by their status
    tasksByStatus() {
        const tasks = this.taskService.getTasks();
        const result = {};
        tasks.forEach(t => result[t.status] = (result[t.status] || 0) + 1);
        return result;
    }
}
//# sourceMappingURL=StatisticService.js.map