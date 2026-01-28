import { Comment } from '../models/Comments';

// COMMENT SERVICE - Manages task comments and discussions
export class CommentService {
  // Array storing all comments
  private comments: Comment[] = [];
  // Counter for generating unique comment IDs
  private idCounter = 1;

  // Adds a new comment to a task with auto-generated ID and timestamp
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

  // Retrieves all comments for a specific task
  getComments(taskId: number): Comment[] {
    return this.comments.filter(c => c.taskId === taskId);
  }

  // Removes a comment by ID
  deleteComment(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }
}
