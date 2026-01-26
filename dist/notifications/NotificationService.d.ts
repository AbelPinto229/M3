export declare class NotificationService {
    /**
     * Notifica um usuário específico
     * @param userId - ID do usuário
     * @param message - mensagem a enviar
     */
    notifyUser(userId: number, message: string): void;
    /**
     * Notifica um grupo de usuários
     * @param userIds - array de IDs
     * @param message - mensagem
     */
    notifyGroup(userIds: number[], message: string): void;
    /**
     * Notifica todos os administradores
     * @param message - mensagem

     */
    notifyAdmins(message: string): void;
}
