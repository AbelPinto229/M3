export declare class Comment {
    static nextId: number;
    id: number;
    taskId: number;
    userId: number;
    content: string;
    timestamp: Date;
    constructor(taskId: number, userId: number, content: string);
}
export declare function addComment(taskID: number, userID: number, content: string): Comment;
export declare function getComments(taskID: number): Comment[];
export declare function deleteComment(commentID: number): void;
