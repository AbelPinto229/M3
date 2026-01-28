// src/attachments/Attachment.ts
export class Attachment {
    id;
    taskId;
    filename;
    size;
    url;
    uploadedAt;
    constructor(id, taskId, filename, size, url, uploadedAt) {
        this.id = id;
        this.taskId = taskId;
        this.filename = filename;
        this.size = size;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }
}
//# sourceMappingURL=Attachments.js.map