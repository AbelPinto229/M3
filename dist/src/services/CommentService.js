// COMMENT SERVICE - Manages task comments and discussions
export class CommentService {
    // Array storing all comments
    comments = [];
    // Counter for generating unique comment IDs
    idCounter = 1;
    // Adds a new comment to a task with auto-generated ID and timestamp
    addComment(taskId, userId, message) {
        const comment = {
            id: this.idCounter++,
            taskId,
            userId,
            message,
            createdAt: new Date()
        };
        this.comments.push(comment);
    }
    // Retrieves all comments for a specific task
    getComments(taskId) {
        return this.comments.filter(c => c.taskId === taskId);
    }
    // Removes a comment by ID
    deleteComment(commentId) {
        this.comments = this.comments.filter(c => c.id !== commentId);
    }
}
//# sourceMappingURL=CommentService.js.map