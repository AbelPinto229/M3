export declare class NotificationService {
    /**
     * Adiciona uma notificação visual na UI
     * @param message - Mensagem a exibir
     * @param type - Tipo de notificação (success, warning, info)
     */
    addNotification(message: string, type?: 'success' | 'warning' | 'info'): void;
    /**
     * Notifica um usuário específico (log console)
     * @param userId - ID do usuário
     * @param message - mensagem a enviar
     */
    notifyUser(userId: number, message: string): void;
    /**
     * Notifica um grupo de usuários (log console)
     * @param userIds - array de IDs
     * @param message - mensagem
     */
    notifyGroup(userIds: number[], message: string): void;
    /**
     * Notifica todos os administradores (log console)
     * @param message - mensagem
     */
    notifyAdmins(message: string): void;
}
