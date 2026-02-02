// NOTIFICATION SERVICE - User notifications

export class NotificationService {

    // display UI notification with auto-fade on screen
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

    // notify specific user with UI alert
    notifyUser(userId: number, message: string) {
        this.addNotification(`[User ${userId}] ${message}`, 'info');
    }

    // notify multiple users with UI alerts
    notifyGroup(userIds: number[], message: string) {
        userIds.forEach(id => {
            this.addNotification(`[User ${id}] ${message}`, 'info');
        });
    }

    // notify all admins with UI alert
    notifyAdmins(message: string) {
        this.addNotification(`[ADMIN] ${message}`, 'warning');
    }
}
