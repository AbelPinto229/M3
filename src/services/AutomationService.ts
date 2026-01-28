// AUTOMATION SERVICE - Applies business rules and automation logic to tasks and users
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

  // Applies all automation rules to a task (completion, blocked, expiration checks)
  applyRules(task: Task) {
    this.ruleTaskCompleted(task);
    this.ruleTaskBlocked(task);
    this.ruleTaskExpired(task);
  }

  // Applies all automation rules to a user (inactive status check)
  applyUserRules(user: User) {
    this.ruleUserInactive(user);
  }

  // Rules - Business logic

  // Rule: Task completed - logs completion event
  private ruleTaskCompleted(task: Task) {
    if (task.status === TaskStatus.COMPLETED) {
      console.log(`LOG: Task "${task.title}" has been completed.`);
    }
  }

  // Rule: Task blocked - notifies about blocked status
  private ruleTaskBlocked(task: Task) {
    if (task.status === 'BLOCKED') {
      console.log(`NOTIFICATION: Task "${task.title}" is blocked.`);
    }
  }

  // Rule: Task expired - auto-blocks expired tasks that are not completed
  private ruleTaskExpired(task: Task) {
    if (this.deadlineService.isExpired(task.id) && task.status !== TaskStatus.COMPLETED) {
      task.status = 'BLOCKED';
      console.log(`RULE: Task "${task.title}" expired and was blocked.`);
    }
  }

  // Rule: User inactive - removes all task assignments from inactive users
  private ruleUserInactive(user: User) {
    if (!user.active) {
      const tasks = this.assignmentService.getTasksFromUser(user.id);
      tasks.forEach(taskId => this.assignmentService.unassignUser(taskId, user.id));
      console.log(`RULE: Inactive user "${user.email}", assignments removed.`);
    }
  }
}

// BACKUP SERVICE - Exports and manages data backups
export class BackupService {
  constructor(private users: User[], private tasks: Task[], private assignments: any) {}

  // Exports a copy of all users
  exportUsers() { return [...this.users]; }
  // Exports a copy of all tasks
  exportTasks() { return [...this.tasks]; }
  // Exports a copy of all assignments
  exportAssignments() { return { ...this.assignments }; }
  // Exports all data (users, tasks, assignments) as a backup object
  exportAll() {
    return {
      users: this.exportUsers(),
      tasks: this.exportTasks(),
      assignments: this.exportAssignments()
    };
  }
}
