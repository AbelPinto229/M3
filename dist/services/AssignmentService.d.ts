export declare class AssignmentService {
    private taskToUsers;
    private userToTasks;
    assignUser(taskId: number, userId: number): void;
    unassignUser(taskId: number, userId: number): void;
    getUsersFromTask(taskId: number): number[];
    getTasksFromUser(userId: number): number[];
}
