import { ExtendedTask } from './TaskService.js';

// PRIORITY SERVICE - Task priorities
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class PriorityService {
  private priorities: Map<number, Priority> = new Map();

  // Set priority for a task
  setPriority(taskId: number, priority: Priority): void {
    this.priorities.set(taskId, priority);
  }

  // Get priority for a task
  getPriority(taskId: number): Priority | undefined {
    return this.priorities.get(taskId);
  }

  // Get all high priority tasks (HIGH and CRITICAL)
  getHighPriorityTasks(): number[] {
    const result: number[] = [];
    this.priorities.forEach((priority, taskId) => {
      if (priority === Priority.HIGH || priority === Priority.CRITICAL) result.push(taskId);
    });
    return result;
  }

  // Filter tasks by priority
  getTasksByPriority(tasks: ExtendedTask[], priority: string): ExtendedTask[] {
    return tasks.filter(t => t.priority === priority);
  }

  // Get all available priority levels
  getPriorities(): string[] {
    return ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  }

  // Sort tasks by priority (CRITICAL > HIGH > MEDIUM > LOW)
  sortTasksByPriority(tasks: ExtendedTask[]): ExtendedTask[] {
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return [...tasks].sort((a, b) => 
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
    );
  }
}

