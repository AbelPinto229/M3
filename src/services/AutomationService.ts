import { User } from '../models/Users';
import { Task } from "../models/task";
import { AssignmentService } from './AssignmentService.js';
import { DeadlineService } from './DeadlineService.js';

export class AutomationRulesService {
  constructor(
    private assignmentService: AssignmentService,
    private deadlineService: DeadlineService
  ) {}

  // 👉 Lê o estado da task e aplica regras
  applyRules(task: Task) {
    this.ruleTaskCompleted(task);
    this.ruleTaskBlocked(task);
    this.ruleTaskExpired(task);
  }

  // 👉 Lê o estado do user e aplica regras
  applyUserRules(user: User) {
    this.ruleUserInactive(user);
  }

  // ===== REGRAS (funções pequenas) =====

  // Se task ficar COMPLETED → criar log automático
  private ruleTaskCompleted(task: Task) {
    if (task.status === 'Concluído') {
      console.log(`LOG: Task "${task.title}" foi concluída.`);
    }
  }

  // Se task ficar BLOCKED → notificar
  private ruleTaskBlocked(task: Task) {
    if (task.status === 'Bloqueada') {
      console.log(`NOTIFICAÇÃO: Task "${task.title}" está bloqueada.`);
    }
  }

  // Se task expirar → mover para BLOCKED
  private ruleTaskExpired(task: Task) {
    if (this.deadlineService.isExpired(task.id) && task.status !== 'Concluído') {
      task.status = 'Bloqueada';
      console.log(`REGRA: Task "${task.title}" expirou e foi bloqueada.`);
    }
  }

  // Se user ficar inactive → remover assignments
  private ruleUserInactive(user: User) {
    if (!user.active) {
      const tasks = this.assignmentService.getTasksFromUser(user.id);
      tasks.forEach(taskId => this.assignmentService.unassignUser(taskId, user.id));
      console.log(`REGRA: User "${user.email}" inativo, tarefas removidas.`);
    }
  }
}

export class BackupService {
  constructor(private users: User[], private tasks: Task[], private assignments: any) {}

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
