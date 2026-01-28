import { Comment } from '../models/Comments';
export declare class CommentService {
    private comments;
    private idCounter;
    addComment(taskId: number, userId: number, message: string): void;
    getComments(taskId: number): Comment[];
    deleteComment(commentId: number): void;
}
