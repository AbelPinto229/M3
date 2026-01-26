"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
// src/attachments/Attachment.ts
class Attachment {
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
exports.Attachment = Attachment;
//# sourceMappingURL=Attachments.js.map