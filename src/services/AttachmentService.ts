// src/attachments/AttachmentService.ts
import { Attachment } from '../attachments/attachments';

export class AttachmentService {
    private attachments: Attachment[] = []; // lista interna de anexos
    private attachmentIdCounter: number = 1;

    // Adiciona um novo anexo a uma tarefa
    addAttachment(taskId: number, filename: string, size: number, url: string): Attachment {
        const attachment = new Attachment(
            this.attachmentIdCounter++,
            taskId,
            filename,
            size,
            url,
            new Date()
        );
        this.attachments.push(attachment);
        return attachment;
    }

    // Retorna todos anexos de uma tarefa
    getAttachments(taskId: number): Attachment[] {
        return this.attachments.filter(att => att.taskId === taskId);
    }

    // Remove anexo pelo id
    removeAttachment(attachmentId: number): boolean {
        const index = this.attachments.findIndex(att => att.id === attachmentId);
        if (index !== -1) {
            this.attachments.splice(index, 1);
            return true;
        }
        return false;
    }
}
