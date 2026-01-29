// NOTIFICATION SERVICE - User notifications
export class NotificationService {
    // display UI notification with auto-fade on screen
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
    // notify specific user with UI alert
    notifyUser(userId, message) {
        this.addNotification(`[User ${userId}] ${message}`, 'info');
    }
    // notify multiple users with UI alerts
    notifyGroup(userIds, message) {
        userIds.forEach(id => {
            this.addNotification(`[User ${id}] ${message}`, 'info');
        });
    }
    // notify all admins with UI alert
    notifyAdmins(message) {
        this.addNotification(`[ADMIN] ${message}`, 'warning');
    }
}
//# sourceMappingURL=NotificationService.js.map