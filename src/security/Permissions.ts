
import { UserRole } from './UserRole.js';

// check if role can create tasks, in this case only admin and manager can create tasks
export function canCreateTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

// check if role can edit tasks, in this case only admin and manager can edit tasks
export function canEditTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

// check if role can delete tasks, in this case only admin can delete tasks
export function canDeleteTask(role: UserRole): boolean {
    return role === UserRole.ADMIN; // Only admins can delete
}

// check if role can assign tasks, in this case only admin and manager can assign tasks
export function canAssignTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
