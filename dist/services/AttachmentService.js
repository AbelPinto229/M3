"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentService = void 0;
// src/attachments/AttachmentService.ts
const attachments_1 = require("../attachments/attachments");
class AttachmentService {
    attachments = []; // lista interna de anexos
    attachmentIdCounter = 1;
    // Adiciona um novo anexo a uma tarefa
    addAttachment(taskId, filename, size, url) {
        const attachment = new attachments_1.Attachment(this.attachmentIdCounter++, taskId, filename, size, url, new Date());
        this.attachments.push(attachment);
        return attachment;
    }
    // Retorna todos anexos de uma tarefa
    getAttachments(taskId) {
        return this.attachments.filter(att => att.taskId === taskId);
    }
    // Remove anexo pelo id
    removeAttachment(attachmentId) {
        const index = this.attachments.findIndex(att => att.id === attachmentId);
        if (index !== -1) {
            this.attachments.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.AttachmentService = AttachmentService;
//# sourceMappingURL=AttachmentService.js.map