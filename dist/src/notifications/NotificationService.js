// src/notifications/NotificationService.ts
export class NotificationService {
    /**
     * Adiciona uma notificação visual na UI
     * @param message - Mensagem a exibir
     * @param type - Tipo de notificação (success, warning, info)
     */
    addNotification(message, type = 'success') {
        const container = document.getElementById('notifications');
        if (!container)
            return;
        const colors = {
            success: 'bg-white border-emerald-500 text-emerald-700 shadow-xl',
            warning: 'bg-white border-red-500 text-red-700 shadow-xl',
            info: 'bg-white border-indigo-500 text-indigo-700 shadow-xl',
        };
        const notification = document.createElement('div');
        notification.className = `p-4 mb-3 border-l-4 rounded-xl text-xs font-bold transition-all duration-500 transform translate-x-0 pointer-events-auto relative z-[9999] border ${colors[type]}`;
        notification.innerHTML = message;
        container.prepend(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    /**
     * Notifica um usuário específico (log console)
     * @param userId - ID do usuário
     * @param message - mensagem a enviar
     */
    notifyUser(userId, message) {
        console.log(`[NOTIFY] Usuário ${userId}: ${message}`);
    }
    /**
     * Notifica um grupo de usuários (log console)
     * @param userIds - array de IDs
     * @param message - mensagem
     */
    notifyGroup(userIds, message) {
        userIds.forEach(id => {
            console.log(`[NOTIFY] Usuário ${id}: ${message}`);
        });
    }
    /**
     * Notifica todos os administradores (log console)
     * @param message - mensagem
     */
    notifyAdmins(message) {
        // Aqui, só como exemplo, vamos supor que admins têm IDs 1 e 2
        const adminIds = [1, 2];
        this.notifyGroup(adminIds, message);
    }
}
//# sourceMappingURL=NotificationService.js.map