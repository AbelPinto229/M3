export declare class Attachment {
    id: number;
    taskId: number;
    filename: string;
    size: number;
    url: string;
    uploadedAt: Date;
    constructor(id: number, taskId: number, filename: string, size: number, // em bytes
    url: string, uploadedAt: Date);
}
