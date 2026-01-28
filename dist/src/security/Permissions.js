import { UserRole } from './UserRole.js';
/**
 * Verifica se o role tem permissão para criar tarefas
 */
export function canCreateTask(role) {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
/**
 * Verifica se o role tem permissão para editar tarefas
 */
export function canEditTask(role) {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
/**
 * Verifica se o role tem permissão para apagar tarefas
 */
export function canDeleteTask(role) {
    return role === UserRole.ADMIN; // apenas admins podem apagar
}
/**
 * Verifica se o role tem permissão para atribuir tarefas
 */
export function canAssignTask(role) {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
//# sourceMappingURL=Permissions.js.map