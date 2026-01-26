"use strict";
/*
Sistema de anexos (ficheiros) nas tarefas.

Dicas (como implementar):
- Primeiro cria a classe Attachment
- Cria uma lista interna de anexos
- addAttachment deve:
→ criar objeto Attachment
→ guardar na lista
- getAttachments(taskId) deve:
→ filtrar por taskId
- removeAttachment deve:
→ remover por id
- Implementa como CommentService, mas com dados de ficheiro
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentService = void 0;
exports.addAttachment = addAttachment;
exports.getAttachments = getAttachments;
exports.removeAttachment = removeAttachment;
class AttachmentService {
    attachments = [];
    attachmentIdCounter = 1;
}
exports.AttachmentService = AttachmentService;
function addAttachment(taskId, fileName, fileType, fileSize) {
    const attachment = {
        id: this.attachmentIdCounter++,
        taskId,
        fileName,
        fileType,
        fileSize,
        uploadDate: new Date()
    };
    this.attachments.push(attachment);
    return attachment;
}
function getAttachments(taskID) {
    return this.attachments.filter(att => att.taskId === taskID);
}
function removeAttachment(attachmentID) {
    const index = this.attachments.findIndex(att => att.id === attachmentID);
    if (index === -1)
        return false;
    this.attachments.splice(index, 1);
    return true;
}
//# sourceMappingURL=AttachmentService.js.map