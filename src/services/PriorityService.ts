export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class PriorityService {
  private priorities: Map<number, Priority> = new Map();

  setPriority(taskId: number, priority: Priority) {
    this.priorities.set(taskId, priority);
  }

  getPriority(taskId: number): Priority | undefined {
    return this.priorities.get(taskId);
  }

  getHighPriorityTasks(): number[] {
    const result: number[] = [];
    this.priorities.forEach((priority, taskId) => {
      if (priority === Priority.HIGH || priority === Priority.CRITICAL) result.push(taskId);
    });
    return result;
  }
}
