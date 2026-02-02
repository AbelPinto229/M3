import { Comment } from '../models/Comments';

// COMMENT SERVICE - Manages task comments and discussions
export class CommentService {
  // array to save all comments
  private comments: Comment[] = [];
  // counter for generating unique comment IDs for tracking and deletion
  private idCounter = 1;

  // adds a new comment to a task with auto-generated ID and timestamp
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

  // retrieves all comments for a specific task
  getComments(taskId: number): Comment[] {
    return this.comments.filter(c => c.taskId === taskId);
  }

  // removes a comment by ID
  deleteComment(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }
}
