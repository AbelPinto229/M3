import { User } from '../models/Users';
import { Task } from '../models/ask';

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
