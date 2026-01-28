import { Attachment } from '../models/Attachments';

export class AttachmentService {
  private attachments: Attachment[] = [];
  private idCounter = 1;

  addAttachment(taskId: number, attachment: Omit<Attachment, 'id' | 'uploadedAt'>) {
    const newAttachment: Attachment = {
      ...attachment,
      id: this.idCounter++,
      taskId,
      uploadedAt: new Date()
    };
    this.attachments.push(newAttachment);
  }

  getAttachments(taskId: number): Attachment[] {
    return this.attachments.filter(a => a.taskId === taskId);
  }

  removeAttachment(attachmentId: number) {
    this.attachments = this.attachments.filter(a => a.id !== attachmentId);
  }
}
