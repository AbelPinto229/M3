"use strict";
/*Sistema de comentários em tarefas.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
exports.addComment = addComment;
exports.getComments = getComments;
exports.deleteComment = deleteComment;
//Primeiro cria a classe Comment
class Comment {
    static nextId = 1;
    id;
    taskId;
    userId;
    content;
    timestamp;
    constructor(taskId, userId, content) {
        this.id = Comment.nextId++;
        this.taskId = taskId;
        this.userId = userId;
        this.content = content;
        this.timestamp = new Date();
    }
}
exports.Comment = Comment;
//Depois cria uma lista interna de comentários
const comments = [];
/*addComment deve:
→ criar um Comment
→ adicionar à lista
*/
function addComment(taskID, userID, content) {
    const comment = new Comment(taskID, userID, content);
    comments.push(comment);
    return comment;
}
/*- getComments(taskId) deve:
→ filtrar a lista por taskId
*/
function getComments(taskID) {
    return comments.filter(comment => comment.taskId === taskID);
}
/*
- deleteComment deve:
→ filtrar removendo o id
- Implementa em ordem:
classe → lista → add → get → delete
*/
function deleteComment(commentID) {
    const index = comments.findIndex(comment => comment.id === commentID);
    if (index !== -1) {
        comments.splice(index, 1);
    }
}
//# sourceMappingURL=CommentService.js.map