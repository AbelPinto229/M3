// NOTIFICATION SERVICE - User notifications

export class NotificationService {

    // Display UI notification with auto-fade
    addNotification(message: string, type: 'success' | 'warning' | 'info' = 'success'): void {
        const container = document.getElementById('notifications');
        if (!container) return;

        const colors: Record<string, string> = {
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

    // Notify specific user (console log)
    notifyUser(userId: number, message: string) {
        console.log(`[NOTIFY] Usuário ${userId}: ${message}`);
    }

    // Notify multiple users (console log)
    notifyGroup(userIds: number[], message: string) {
        userIds.forEach(id => {
            console.log(`[NOTIFY] Usuário ${id}: ${message}`);
        });
    }

    // Notify all admins
    notifyAdmins(message: string) {
        const adminIds = [1, 2];
        this.notifyGroup(adminIds, message);
    }
}
