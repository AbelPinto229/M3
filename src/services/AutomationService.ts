// AUTOMATION SERVICE - Business rules
import { User } from '../models/Users';
import { Task } from "../models/Task";
import { TaskStatus } from '../tasks/TaskStatus.js';
import { AssignmentService } from './AssignmentService.js';
import { DeadlineService } from './DeadlineService.js';

export class AutomationRulesService {
  constructor(
    private assignmentService: AssignmentService,
    private deadlineService: DeadlineService
  ) {}

  // Apply all rules for a task
  applyRules(task: Task) {
    this.ruleTaskCompleted(task);
    this.ruleTaskBlocked(task);
    this.ruleTaskExpired(task);
  }

  // Apply all rules for a user
  applyUserRules(user: User) {
    this.ruleUserInactive(user);
  }

  // Rules - Business logic

  // Task completed: log the event
  private ruleTaskCompleted(task: Task) {
    if (task.status === TaskStatus.COMPLETED) {
      console.log(`LOG: Task "${task.title}" has been completed.`);
    }
  }

  // Task blocked: notify about it
  private ruleTaskBlocked(task: Task) {
    if (task.status === 'Bloqueada') {
      console.log(`NOTIFICATION: Task "${task.title}" is blocked.`);
    }
  }

  // Task expired: auto-block it
  private ruleTaskExpired(task: Task) {
    if (this.deadlineService.isExpired(task.id) && task.status !== TaskStatus.COMPLETED) {
      task.status = 'Bloqueada';
      console.log(`RULE: Task "${task.title}" expired and was blocked.`);
    }
  }

  // User inactive: remove assignments
  private ruleUserInactive(user: User) {
    if (!user.active) {
      const tasks = this.assignmentService.getTasksFromUser(user.id);
      tasks.forEach(taskId => this.assignmentService.unassignUser(taskId, user.id));
      console.log(`RULE: Inactive user "${user.email}", assignments removed.`);
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
