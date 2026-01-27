"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
class CommentService {
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
exports.CommentService = CommentService;
//# sourceMappingURL=CommentService.js.map