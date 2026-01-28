
import { UserRole } from './UserRole.js';

/**
 * Check if role can create tasks
 */
export function canCreateTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

/**
 * Check if role can edit tasks
 */
export function canEditTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

/**
 * Check if role can delete tasks
 */
export function canDeleteTask(role: UserRole): boolean {
    return role === UserRole.ADMIN; // Only admins can delete
}

/**
 * Check if role can assign tasks
 */
export function canAssignTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
