"use strict";
// src/notifications/NotificationService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    /**
     * Notifica um usuário específico
     * @param userId - ID do usuário
     * @param message - mensagem a enviar
     */
    notifyUser(userId, message) {
        console.log(`[NOTIFY] Usuário ${userId}: ${message}`);
    }
    /**
     * Notifica um grupo de usuários
     * @param userIds - array de IDs
     * @param message - mensagem
     */
    notifyGroup(userIds, message) {
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
    notifyAdmins(message) {
        // Aqui, só como exemplo, vamos supor que admins têm IDs 1 e 2
        const adminIds = [1, 2];
        this.notifyGroup(adminIds, message);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map