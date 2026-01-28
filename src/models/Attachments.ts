// ATTACHMENT MODEL - File attachment class

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