// ASSIGNMENT SERVICE - Manages task-to-user assignments with bidirectional mapping
export class AssignmentService {
    // create a map with task IDs as keys and assigned user IDs as values to save assignments to users
    taskToUsers = new Map();
    // create a map with user IDs as keys and assigned task IDs as values to save assignments to tasks
    userToTasks = new Map();
    // check if task and user exists, if not create new set and add the assignment to both maps
    assignUser(taskId, userId) {
        if (!this.taskToUsers.has(taskId))
            this.taskToUsers.set(taskId, new Set());
        if (!this.userToTasks.has(userId))
            this.userToTasks.set(userId, new Set());
        this.taskToUsers.get(taskId)?.add(userId);
        this.userToTasks.get(userId)?.add(taskId);
    }
    // removes user assignment from a task and task assignment from a user
    unassignUser(taskId, userId) {
        this.taskToUsers.get(taskId)?.delete(userId);
        this.userToTasks.get(userId)?.delete(taskId);
    }
    // retrieves all users assigned to a specific task
    getUsersFromTask(taskId) {
        return Array.from(this.taskToUsers.get(taskId) || []);
    }
    // retrieves all tasks assigned to a specific user
    getTasksFromUser(userId) {
        return Array.from(this.userToTasks.get(userId) || []);
    }
}
//# sourceMappingURL=AssignmentService.js.map