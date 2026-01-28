export class CommentService {
    comments = [];
    idCounter = 1;
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
    getComments(taskId) {
        return this.comments.filter(c => c.taskId === taskId);
    }
    deleteComment(commentId) {
        this.comments = this.comments.filter(c => c.id !== commentId);
    }
}
//# sourceMappingURL=CommentService.js.map