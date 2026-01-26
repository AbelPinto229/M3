export class AssignmentService {
  private taskToUsers: Map<number, Set<number>> = new Map();
  private userToTasks: Map<number, Set<number>> = new Map();

  assignUser(taskId: number, userId: number) {
    if (!this.taskToUsers.has(taskId)) this.taskToUsers.set(taskId, new Set());
    if (!this.userToTasks.has(userId)) this.userToTasks.set(userId, new Set());

    this.taskToUsers.get(taskId)?.add(userId);
    this.userToTasks.get(userId)?.add(taskId);
  }

  unassignUser(taskId: number, userId: number) {
    this.taskToUsers.get(taskId)?.delete(userId);
    this.userToTasks.get(userId)?.delete(taskId);
  }

  getUsersFromTask(taskId: number): number[] {
    return Array.from(this.taskToUsers.get(taskId) || []);
  }

  getTasksFromUser(userId: number): number[] {
    return Array.from(this.userToTasks.get(userId) || []);
  }
}

