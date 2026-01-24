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
     *
     * Para simulação, vamos assumir que os IDs de admins são fixos.
     */
    notifyAdmins(message: string): void;
}
