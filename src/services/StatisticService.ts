import { Task } from '../models/ask';
import { User } from '../models/Users';

export class StatisticsService {
  constructor(private tasks: Task[], private users: User[]) {}

  countUsers() { return this.users.length; }
  countTasks() { return this.tasks.length; }
  countCompletedTasks() { return this.tasks.filter(t => t.status === 'Concluído').length; }
  countActiveTasks() { return this.tasks.filter(t => t.status !== 'Concluído').length; }

  tasksByStatus(): Record<string, number> {
    const result: Record<string, number> = {};
    this.tasks.forEach(t => result[t.status] = (result[t.status] || 0) + 1);
    return result;
  }
}
