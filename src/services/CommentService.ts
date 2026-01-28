import { Comment } from '../models/Comments';

// COMMENT SERVICE - Task comments
export class CommentService {
  private comments: Comment[] = [];
  private idCounter = 1;

  addComment(taskId: number, userId: number, message: string) {
    const comment: Comment = {
      id: this.idCounter++,
      taskId,
      userId,
      message,
      createdAt: new Date()
    };
    this.comments.push(comment);
  }

  getComments(taskId: number): Comment[] {
    return this.comments.filter(c => c.taskId === taskId);
  }

  deleteComment(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }
}
