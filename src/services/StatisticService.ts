import { Task } from '../models/Task';
import { User } from '../models/Users';
import { TaskStatus } from '../tasks/TaskStatus.js';

// Data structure for task statistics summary
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byStatus: Record<string, number>;
}

// Data structure for user statistics summary
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  activeRate: number;
}

// STATISTICS SERVICE - Calculates and provides analytics for tasks and users
export class StatisticsService {
  constructor(private tasks: Task[], private users: User[]) {}

  // Returns total count of users and user statistics
  countUsers(): UserStats {
    const total = this.users.length;
    const active = this.users.filter(u => u.active).length;
    const inactive = total - active;
    const activeRate = total === 0 ? 0 : Math.round((active / total) * 100);

    return { total, active, inactive, activeRate };
  }

  // Returns total count of tasks and task statistics
  countTasks(): TaskStats {
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
  tasksByStatus(): Record<string, number> {
    const result: Record<string, number> = {};
    this.tasks.forEach(t => result[t.status] = (result[t.status] || 0) + 1);
    return result;
  }
}

