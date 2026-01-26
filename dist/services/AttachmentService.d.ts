import { Attachment } from '../attachments/attachments';
export declare class AttachmentService {
    private attachments;
    private attachmentIdCounter;
    addAttachment(taskId: number, filename: string, size: number, url: string): Attachment;
    getAttachments(taskId: number): Attachment[];
    removeAttachment(attachmentId: number): boolean;
}
