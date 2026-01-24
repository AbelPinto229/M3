"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canCreateTask = canCreateTask;
exports.canEditTask = canEditTask;
exports.canDeleteTask = canDeleteTask;
exports.canAssignTask = canAssignTask;
const UserRole_js_1 = require("./UserRole.js");
/**
 * Verifica se o role tem permissão para criar tarefas
 */
function canCreateTask(role) {
    return role === UserRole_js_1.UserRole.ADMIN || role === UserRole_js_1.UserRole.MANAGER;
}
/**
 * Verifica se o role tem permissão para editar tarefas
 */
function canEditTask(role) {
    return role === UserRole_js_1.UserRole.ADMIN || role === UserRole_js_1.UserRole.MANAGER;
}
/**
 * Verifica se o role tem permissão para apagar tarefas
 */
function canDeleteTask(role) {
    return role === UserRole_js_1.UserRole.ADMIN; // apenas admins podem apagar
}
/**
 * Verifica se o role tem permissão para atribuir tarefas
 */
function canAssignTask(role) {
    return role === UserRole_js_1.UserRole.ADMIN || role === UserRole_js_1.UserRole.MANAGER;
}
//# sourceMappingURL=Permissions.js.map