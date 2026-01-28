import { Task } from '../models/Task.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { BugTask } from '../tasks/BugTask.js';

export interface ExtendedTask extends Task {
  priority?: string;
  deadline?: string;
  assigned?: string[];
}

export class TaskService {
  private tasks: ExtendedTask[] = [];
  private nextId = 1;

  getTasks(): ExtendedTask[] {
    return this.tasks;
  }

  getTaskById(id: number): ExtendedTask | undefined {
    return this.tasks.find(t => t.id === id);
  }

  getTasksByStatus(status: string): ExtendedTask[] {
    return this.tasks.filter(t => t.status === status);
  }

  addTask(title: string, type: string, deadline?: string): ExtendedTask {
    let task: ExtendedTask;
    
    // Use BugTask for bug-type tasks
    if (type.toLowerCase() === 'bug') {
      const bugTask = new BugTask(this.nextId++, title);
      task = {
        id: bugTask.id,
        title: bugTask.title,
        type,
        status: bugTask.status,
        deadline
      };
    } else {
      task = {
        id: this.nextId++,
        title,
        type,
        status: TaskStatus.PENDING,
        deadline
      };
    }
    
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: number, status: string): void {
    const task = this.getTaskById(id);
    if (task) task.status = status;
  }

  updateTaskTitle(id: number, title: string): void {
    const task = this.getTaskById(id);
    if (task) task.title = title;
  }

  updateTaskPriority(id: number, priority: string): void {
    const task = this.getTaskById(id);
    if (task) task.priority = priority;
  }

  updateTaskDeadline(id: number, deadline: string): void {
    const task = this.getTaskById(id);
    if (task) task.deadline = deadline;
  }

  assignUser(taskId: number, email: string): void {
    const task = this.getTaskById(taskId);
    if (task) {
      if (!task.assigned) task.assigned = [];
      if (!task.assigned.includes(email)) {
        task.assigned.push(email);
      }
    }
  }

  unassignUser(taskId: number, email: string): void {
    const task = this.getTaskById(taskId);
    if (task && task.assigned) {
      task.assigned = task.assigned.filter(e => e !== email);
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}
