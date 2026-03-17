// ATTACHMENT SERVICE - Manages file attachments for tasks
export class AttachmentService {
    // Array storing all attachments
    attachments = [];
    // Counter for generating unique attachment IDs
    idCounter = 1;
    // Adds a new attachment to a task with auto-generated ID and upload timestamp
    addAttachment(taskId, attachment) {
        const newAttachment = {
            ...attachment,
            id: this.idCounter++,
            taskId,
            uploadedAt: new Date()
        };
        this.attachments.push(newAttachment);
    }
    // Retrieves all attachments for a specific task
    getAttachments(taskId) {
        return this.attachments.filter(a => a.taskId === taskId);
    }
    // Removes an attachment by ID
    removeAttachment(attachmentId) {
        this.attachments = this.attachments.filter(a => a.id !== attachmentId);
    }
}
//# sourceMappingURL=AttachmentService.js.map