import { UserRole } from './UserRole.js';
/**
 * Check if role can create tasks
 */
export declare function canCreateTask(role: UserRole): boolean;
/**
 * Check if role can edit tasks
 */
export declare function canEditTask(role: UserRole): boolean;
/**
 * Check if role can delete tasks
 */
export declare function canDeleteTask(role: UserRole): boolean;
/**
 * Check if role can assign tasks
 */
export declare function canAssignTask(role: UserRole): boolean;
