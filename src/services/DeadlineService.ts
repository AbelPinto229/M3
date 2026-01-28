import { Task } from "../models/Task";

// DEADLINE SERVICE - Manages task deadlines and expiration tracking
export class DeadlineService {
  // Maps task IDs to their deadline dates
  private deadlines: Map<number, Date> = new Map();

  // Sets or updates the deadline for a specific task
  setDeadline(taskId: number, date: Date) {
    this.deadlines.set(taskId, date);
  }

  // Checks if a task deadline has passed the current time
  isExpired(taskId: number): boolean {
    const deadline = this.deadlines.get(taskId);
    if (!deadline) return false;
    return deadline.getTime() < Date.now();
  }

  // Retrieves all task IDs that have expired deadlines
  getExpiredTasks(): number[] {
    const expired: number[] = [];
    this.deadlines.forEach((date, taskId) => {
      if (date.getTime() < Date.now()) expired.push(taskId);
    });
    return expired;
  }
}
