"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = exports.AutomationRulesService = void 0;
class AutomationRulesService {
    assignmentService;
    deadlineService;
    constructor(assignmentService, deadlineService) {
        this.assignmentService = assignmentService;
        this.deadlineService = deadlineService;
    }
    // 👉 Lê o estado da task e aplica regras
    applyRules(task) {
        this.ruleTaskCompleted(task);
        this.ruleTaskBlocked(task);
        this.ruleTaskExpired(task);
    }
    // 👉 Lê o estado do user e aplica regras
    applyUserRules(user) {
        this.ruleUserInactive(user);
    }
    // ===== REGRAS (funções pequenas) =====
    // Se task ficar COMPLETED → criar log automático
    ruleTaskCompleted(task) {
        if (task.status === 'Concluído') {
            console.log(`LOG: Task "${task.title}" foi concluída.`);
        }
    }
    // Se task ficar BLOCKED → notificar
    ruleTaskBlocked(task) {
        if (task.status === 'Bloqueada') {
            console.log(`NOTIFICAÇÃO: Task "${task.title}" está bloqueada.`);
        }
    }
    // Se task expirar → mover para BLOCKED
    ruleTaskExpired(task) {
        if (this.deadlineService.isExpired(task.id) && task.status !== 'Concluído') {
            task.status = 'Bloqueada';
            console.log(`REGRA: Task "${task.title}" expirou e foi bloqueada.`);
        }
    }
    // Se user ficar inactive → remover assignments
    ruleUserInactive(user) {
        if (!user.active) {
            const tasks = this.assignmentService.getTasksFromUser(user.id);
            tasks.forEach(taskId => this.assignmentService.unassignUser(taskId, user.id));
            console.log(`REGRA: User "${user.email}" inativo, tarefas removidas.`);
        }
    }
}
exports.AutomationRulesService = AutomationRulesService;
class BackupService {
    users;
    tasks;
    assignments;
    constructor(users, tasks, assignments) {
        this.users = users;
        this.tasks = tasks;
        this.assignments = assignments;
    }
    exportUsers() { return [...this.users]; }
    exportTasks() { return [...this.tasks]; }
    exportAssignments() { return { ...this.assignments }; }
    exportAll() {
        return {
            users: this.exportUsers(),
            tasks: this.exportTasks(),
            assignments: this.exportAssignments()
        };
    }
}
exports.BackupService = BackupService;
//# sourceMappingURL=AutomationService.js.map