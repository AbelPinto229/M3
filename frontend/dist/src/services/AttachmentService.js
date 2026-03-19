// ATTACHMENT SERVICE - Manages file attachments for tasks
export class AttachmentService {
    API_BASE_URL = 'http://localhost:3000';
    // Array storing all attachments
    attachments = [];
    // Counter for generating unique attachment IDs
    idCounter = 1;
    // Adds a new attachment to a task with API integration
    async addAttachment(taskId, attachment) {
        console.log('📎 Frontend: Adicionando attachment', { taskId, filename: attachment.filename });
        try {
            const response = await fetch(`${this.API_BASE_URL}/attachments/task/${taskId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: attachment.filename,
                    file_url: attachment.url,
                    file_size: attachment.size
                })
            });
            console.log('📡 Resposta da API:', response.status, response.ok);
            if (response.ok) {
                const apiAttachment = await response.json();
                // Convert API format to local format
                const newAttachment = {
                    id: apiAttachment.id,
                    taskId: apiAttachment.task_id,
                    filename: apiAttachment.filename,
                    url: apiAttachment.file_url,
                    size: apiAttachment.file_size,
                    uploadedAt: new Date()
                };
                this.attachments.push(newAttachment);
                console.log('✅ Attachment criado na API:', newAttachment);
                return newAttachment;
            }
            console.error('❌ API retornou erro:', response.status);
            // Fallback: criar localmente
            const newAttachment = {
                ...attachment,
                id: this.idCounter++,
                taskId,
                uploadedAt: new Date()
            };
            this.attachments.push(newAttachment);
            console.log('📦 Modo offline: Attachment criado localmente');
            return newAttachment;
        }
        catch (error) {
            console.error('⚠️ Erro ao criar attachment na API:', error);
            // Fallback: criar localmente
            const newAttachment = {
                ...attachment,
                id: this.idCounter++,
                taskId,
                uploadedAt: new Date()
            };
            this.attachments.push(newAttachment);
            return newAttachment;
        }
    }
    // Retrieves all attachments for a specific task
    getAttachments(taskId) {
        return this.attachments.filter(a => a.taskId === taskId);
    }
    // Removes an attachment by ID
    async removeAttachment(attachmentId) {
        console.log('🗑️ Removendo attachment', attachmentId);
        try {
            const response = await fetch(`${this.API_BASE_URL}/attachments/${attachmentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.attachments = this.attachments.filter(a => a.id !== attachmentId);
                console.log('✅ Attachment removido da API');
            }
            else {
                console.error('❌ Erro ao remover da API:', response.status);
                // Remove localmente mesmo assim
                this.attachments = this.attachments.filter(a => a.id !== attachmentId);
            }
        }
        catch (error) {
            console.error('⚠️ Erro ao remover attachment:', error);
            // Remove localmente
            this.attachments = this.attachments.filter(a => a.id !== attachmentId);
        }
    }
}
//# sourceMappingURL=AttachmentService.js.map