import { User } from '../models/Users';
import { Task } from '../models/Task';
import { UserService } from './UserService.js';
import { TaskService } from './TaskService.js';

// Data structure for storing complete system backup snapshots
export interface BackupData {
  timestamp: Date;
  users: User[];
  tasks: Task[];
  assignments: any;
}

// BACKUP SERVICE - Creates and manages data backups with timestamps
export class BackupService {
  // Array storing all created backups
  private backups: BackupData[] = [];

  constructor(private userService: UserService, private taskService: TaskService, private assignments: any) {}

  // Exports a shallow copy of all users
  exportUsers() { return [...this.userService.getUsers()]; }
  // Exports a shallow copy of all tasks
  exportTasks() { return [...this.taskService.getTasks()]; }
  // Exports a shallow copy of all assignments
  exportAssignments() { return { ...this.assignments }; }
  
  // Exports all data (users, tasks, assignments) in a single object
  exportAll() {
    return {
      users: this.exportUsers(),
      tasks: this.exportTasks(),
      assignments: this.exportAssignments()
    };
  }
}

