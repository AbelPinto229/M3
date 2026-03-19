import { Attachment } from '../models/Attachments';
export declare class AttachmentService {
    private API_BASE_URL;
    private attachments;
    private idCounter;
    addAttachment(taskId: number, attachment: Omit<Attachment, 'id' | 'uploadedAt'>): Promise<Attachment | null>;
    getAttachments(taskId: number): Attachment[];
    removeAttachment(attachmentId: number): Promise<void>;
}
