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

  // set priority for a task
  setPriority(taskId: number, priority: Priority): void {
    this.priorities.set(taskId, priority);
  }

  // get priority for a task
  getPriority(taskId: number): Priority | undefined {
    return this.priorities.get(taskId);
  }

  // get all high priority tasks (HIGH and CRITICAL)
  getHighPriorityTasks(): number[] {
    const result: number[] = [];
    this.priorities.forEach((priority, taskId) => {
      if (priority === Priority.HIGH || priority === Priority.CRITICAL) result.push(taskId);
    });
    return result;
  }
}

