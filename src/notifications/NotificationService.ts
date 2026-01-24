// src/notifications/NotificationService.ts

export class NotificationService {

    /**
     * Notifica um usuário específico
     * @param userId - ID do usuário
     * @param message - mensagem a enviar
     */
    notifyUser(userId: number, message: string) {
        console.log(`[NOTIFY] Usuário ${userId}: ${message}`);
    }

    /**
     * Notifica um grupo de usuários
     * @param userIds - array de IDs
     * @param message - mensagem
     */
    notifyGroup(userIds: number[], message: string) {
        userIds.forEach(id => {
            console.log(`[NOTIFY] Usuário ${id}: ${message}`);
        });
    }

    /**
     * Notifica todos os administradores
     * @param message - mensagem
     * 
     * Para simulação, vamos assumir que os IDs de admins são fixos.
     */
    notifyAdmins(message: string) {
        // Aqui, só como exemplo, vamos supor que admins têm IDs 1 e 2
        const adminIds = [1, 2];
        this.notifyGroup(adminIds, message);
    }
}
