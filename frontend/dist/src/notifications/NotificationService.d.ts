export declare class NotificationService {
    addNotification(message: string, type?: 'success' | 'warning' | 'info'): void;
    notifyUser(userId: number, message: string): void;
    notifyGroup(userIds: number[], message: string): void;
    notifyAdmins(message: string): void;
}
