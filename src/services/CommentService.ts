/*Sistema de comentários em tarefas.
*/

//Primeiro cria a classe Comment
export class Comment {
    static nextId = 1;
    id: number;
    taskId: number;
    userId: number;
    content: string;
    timestamp: Date;
    constructor(taskId: number, userId: number, content: string) {
        this.id = Comment.nextId++;
        this.taskId = taskId; 
        this.userId = userId;
        this.content = content;
        this.timestamp = new Date();
    } 
}
//Depois cria uma lista interna de comentários
const comments: Comment[] = []; 
 /*addComment deve:
→ criar um Comment
→ adicionar à lista
*/
export function addComment(taskID: number, userID: number, content: string): Comment {
    const comment = new Comment(taskID, userID, content);
    comments.push(comment);
    return comment;
}
/*- getComments(taskId) deve:
→ filtrar a lista por taskId
*/
export function getComments(taskID: number): Comment[] {
    return comments.filter(comment => comment.taskId === taskID);
}   
/*
- deleteComment deve:
→ filtrar removendo o id
- Implementa em ordem:
classe → lista → add → get → delete
*/
export function deleteComment(commentID: number): void {
    const index = comments.findIndex(comment => comment.id === commentID);  
    if (index !== -1) {
        comments.splice(index, 1); 
    }   
}
