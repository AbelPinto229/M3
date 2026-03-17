import { Attachment } from '../models/Attachments';
export declare class AttachmentService {
    private attachments;
    private idCounter;
    addAttachment(taskId: number, attachment: Omit<Attachment, 'id' | 'uploadedAt'>): void;
    getAttachments(taskId: number): Attachment[];
    removeAttachment(attachmentId: number): void;
}
