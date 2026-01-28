import { UserRole } from './UserRole.js';
/**
 * Verifica se o role tem permissão para criar tarefas
 */
export declare function canCreateTask(role: UserRole): boolean;
/**
 * Verifica se o role tem permissão para editar tarefas
 */
export declare function canEditTask(role: UserRole): boolean;
/**
 * Verifica se o role tem permissão para apagar tarefas
 */
export declare function canDeleteTask(role: UserRole): boolean;
/**
 * Verifica se o role tem permissão para atribuir tarefas
 */
export declare function canAssignTask(role: UserRole): boolean;
