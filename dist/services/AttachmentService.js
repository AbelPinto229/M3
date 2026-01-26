"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentService = void 0;
class AttachmentService {
    attachments = [];
    idCounter = 1;
    addAttachment(taskId, attachment) {
        const newAttachment = {
            ...attachment,
            id: this.idCounter++,
            taskId,
            uploadedAt: new Date()
        };
        this.attachments.push(newAttachment);
    }
    getAttachments(taskId) {
        return this.attachments.filter(a => a.taskId === taskId);
    }
    removeAttachment(attachmentId) {
        this.attachments = this.attachments.filter(a => a.id !== attachmentId);
    }
}
exports.AttachmentService = AttachmentService;
//# sourceMappingURL=AttachmentService.js.map