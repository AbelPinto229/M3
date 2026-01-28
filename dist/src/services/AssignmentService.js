// ASSIGNMENT SERVICE - Task assignments
export class AssignmentService {
    taskToUsers = new Map();
    userToTasks = new Map();
    assignUser(taskId, userId) {
        if (!this.taskToUsers.has(taskId))
            this.taskToUsers.set(taskId, new Set());
        if (!this.userToTasks.has(userId))
            this.userToTasks.set(userId, new Set());
        this.taskToUsers.get(taskId)?.add(userId);
        this.userToTasks.get(userId)?.add(taskId);
    }
    unassignUser(taskId, userId) {
        this.taskToUsers.get(taskId)?.delete(userId);
        this.userToTasks.get(userId)?.delete(taskId);
    }
    getUsersFromTask(taskId) {
        return Array.from(this.taskToUsers.get(taskId) || []);
    }
    getTasksFromUser(userId) {
        return Array.from(this.userToTasks.get(userId) || []);
    }
}
//# sourceMappingURL=AssignmentService.js.map