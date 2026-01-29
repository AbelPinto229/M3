// ATTACHMENT MODEL - Represents an attachment linked to a task
export class Attachment {
    constructor(
        public id: number,
        public taskId: number,
        public filename: string,
        public size: number,      
        public url: string,
        public uploadedAt: Date
    ) {}
}