// ASSIGNMENT SERVICE - Manages task-to-user assignments with bidirectional mapping
export class AssignmentService {
  // Maps task IDs to assigned user IDs
  private taskToUsers: Map<number, Set<number>> = new Map();
  // Maps user IDs to assigned task IDs
  private userToTasks: Map<number, Set<number>> = new Map();

  // Assigns a user to a task, maintaining bidirectional relationship
  assignUser(taskId: number, userId: number) {
    if (!this.taskToUsers.has(taskId)) this.taskToUsers.set(taskId, new Set());
    if (!this.userToTasks.has(userId)) this.userToTasks.set(userId, new Set());

    this.taskToUsers.get(taskId)?.add(userId);
    this.userToTasks.get(userId)?.add(taskId);
  }

  // Removes user assignment from a task
  unassignUser(taskId: number, userId: number) {
    this.taskToUsers.get(taskId)?.delete(userId);
    this.userToTasks.get(userId)?.delete(taskId);
  }

  // Retrieves all users assigned to a specific task
  getUsersFromTask(taskId: number): number[] {
    return Array.from(this.taskToUsers.get(taskId) || []);
  }

  // Retrieves all tasks assigned to a specific user
  getTasksFromUser(userId: number): number[] {
    return Array.from(this.userToTasks.get(userId) || []);
  }
}

