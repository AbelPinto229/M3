import { Task } from '../models/Task';
import { User } from '../models/Users';
import { TaskStatus } from '../tasks/TaskStatus.js';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byStatus: Record<string, number>;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  activeRate: number;
}

export class StatisticsService {
  constructor(private tasks: Task[], private users: User[]) {}

  countUsers() { return this.users.length; }
  countTasks() { return this.tasks.length; }
  countCompletedTasks() { return this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length; }
  countActiveTasks() { return this.tasks.filter(t => t.status !== TaskStatus.COMPLETED).length; }

  tasksByStatus(): Record<string, number> {
    const result: Record<string, number> = {};
    this.tasks.forEach(t => result[t.status] = (result[t.status] || 0) + 1);
    return result;
  }

  calculateTaskStats(): TaskStats {
    const total = this.tasks.length;
    const completed = this.countCompletedTasks();
    const pending = this.countActiveTasks();
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const byStatus = this.tasksByStatus();

    return { total, completed, pending, completionRate, byStatus };
  }

  calculateUserStats(): UserStats {
    const total = this.users.length;
    const active = this.users.filter(u => u.active).length;
    const inactive = total - active;
    const activeRate = total === 0 ? 0 : Math.round((active / total) * 100);

    return { total, active, inactive, activeRate };
  }
}

