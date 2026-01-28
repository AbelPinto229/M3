import { Attachment } from '../models/Attachments';

// ATTACHMENT SERVICE - Manages file attachments for tasks
export class AttachmentService {
  // Array storing all attachments
  private attachments: Attachment[] = [];
  // Counter for generating unique attachment IDs
  private idCounter = 1;

  // Adds a new attachment to a task with auto-generated ID and upload timestamp
  addAttachment(taskId: number, attachment: Omit<Attachment, 'id' | 'uploadedAt'>) {
    const newAttachment: Attachment = {
      ...attachment,
      id: this.idCounter++,
      taskId,
      uploadedAt: new Date()
    };
    this.attachments.push(newAttachment);
  }

  // Retrieves all attachments for a specific task
  getAttachments(taskId: number): Attachment[] {
    return this.attachments.filter(a => a.taskId === taskId);
  }

  // Removes an attachment by ID
  removeAttachment(attachmentId: number) {
    this.attachments = this.attachments.filter(a => a.id !== attachmentId);
  }
}
