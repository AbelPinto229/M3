// Regras globais de negócio do sistema
export class BusinessRules {
    // Verificar se utilizador pode ser desativado
    static canUserBeDeactivated(activeTasks) {
        // Utilizador não pode ser desativado se tem tarefas ativas
        return activeTasks === 0;
    }
    // Verificar se tarefa pode ser concluída
    static canTaskBeCompleted(isBlocked) {
        // Tarefa não pode ser concluída se estiver bloqueada
        return !isBlocked;
    }
    // Verificar se tarefa pode ser atribuída
    static canAssignTask(active) {
        // Tarefa só pode ser atribuída a utilizadores ativos
        return active;
    }
    // Validar título de tarefa
    static isValidTitle(title) {
        // Título deve ter entre 5 e 100 caracteres
        return title && title.trim().length >= 5 && title.length <= 100;
    }
    // Validar prioridade
    static isValidPriority(priority) {
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        return validPriorities.includes(priority);
    }
    // Validar role de utilizador
    static isValidRole(role) {
        const validRoles = ['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'];
        return validRoles.includes(role);
    }
}
//# sourceMappingURL=BusinessRules.js.map