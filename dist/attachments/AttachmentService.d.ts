export declare class AttachmentService {
    private attachments;
    private attachmentIdCounter;
}
export declare function addAttachment(taskId: number, fileName: string, fileType: string, fileSize: number): AttachmentService;
export declare function getAttachments(taskID: number): AttachmentService[];
export declare function removeAttachment(attachmentID: number): boolean;
