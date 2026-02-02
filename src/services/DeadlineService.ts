import { Task } from "../models/Task";

// DEADLINE SERVICE - Manages task deadlines and expiration tracking
export class DeadlineService {
  // create a map with id as key and deadline date as value
  private deadlines: Map<number, Date> = new Map();

  // set and update deadline for a task using task id and date
  setDeadline(taskId: number, date: Date) {
    this.deadlines.set(taskId, date);
  }

  // check if task expired by comparing current date with deadline, if date.now is higher that deadline return true, if not false
  isExpired(taskId: number): boolean {
    const deadline = this.deadlines.get(taskId);
    if (!deadline) return false;
    return deadline.getTime() < Date.now();
  }

  // check all task with same logic of isExpired but push to array all expired ids and return the array
  getExpiredTasks(): number[] {
    const expired: number[] = [];
    this.deadlines.forEach((date, taskId) => {
      if (date.getTime() < Date.now()) expired.push(taskId);
    });
    return expired;
  }
}
