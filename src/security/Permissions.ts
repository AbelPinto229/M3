
import { UserRole } from './UserRole.js';

/**
 * Verifica se o role tem permissão para criar tarefas
 */
export function canCreateTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

/**
 * Verifica se o role tem permissão para editar tarefas
 */
export function canEditTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

/**
 * Verifica se o role tem permissão para apagar tarefas
 */
export function canDeleteTask(role: UserRole): boolean {
    return role === UserRole.ADMIN; // apenas admins podem apagar
}

/**
 * Verifica se o role tem permissão para atribuir tarefas
 */
export function canAssignTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
