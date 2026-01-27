import { Task } from "../models/task";

export class DeadlineService {
  private deadlines: Map<number, Date> = new Map();

  setDeadline(taskId: number, date: Date) {
    this.deadlines.set(taskId, date);
  }

  isExpired(taskId: number): boolean {
    const deadline = this.deadlines.get(taskId);
    if (!deadline) return false;
    return deadline.getTime() < Date.now();
  }

  getExpiredTasks(): number[] {
    const expired: number[] = [];
    this.deadlines.forEach((date, taskId) => {
      if (date.getTime() < Date.now()) expired.push(taskId);
    });
    return expired;
  }
}
