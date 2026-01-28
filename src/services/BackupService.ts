import { User } from '../models/Users';
import { Task } from '../models/Task';

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

  constructor(private users: User[], private tasks: Task[], private assignments: any) {}

  // Exports a shallow copy of all users
  exportUsers() { return [...this.users]; }
  // Exports a shallow copy of all tasks
  exportTasks() { return [...this.tasks]; }
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

  // Creates a new backup with current timestamp and stores it
  createBackup(): BackupData {
    const backup: BackupData = {
      timestamp: new Date(),
      users: this.exportUsers(),
      tasks: this.exportTasks(),
      assignments: this.exportAssignments()
    };
    this.backups.push(backup);
    return backup;
  }

  // Retrieves a copy of all stored backups
  getBackups(): BackupData[] {
    return [...this.backups];
  }

  // Retrieves the most recent backup or undefined if no backups exist
  getLastBackup(): BackupData | undefined {
    return this.backups[this.backups.length - 1];
  }

  // Clears all stored backups
  clearBackups(): void {
    this.backups = [];
  }
}

