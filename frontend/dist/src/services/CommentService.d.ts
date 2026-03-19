import { Comment } from '../models/Comments';
export declare class CommentService {
    private API_BASE_URL;
    private comments;
    private idCounter;
    addComment(taskId: number, userId: number, message: string): Promise<Comment | null>;
    getComments(taskId: number): Comment[];
    loadComments(taskId: number): Promise<void>;
    deleteComment(commentId: number): void;
}
