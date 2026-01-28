import { User } from '../models/Users';
import { Task } from '../models/Task';

// BACKUP DATA
export interface BackupData {
  timestamp: Date;
  users: User[];
  tasks: Task[];
  assignments: any;
}

export class BackupService {
  private backups: BackupData[] = [];

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

  getBackups(): BackupData[] {
    return [...this.backups];
  }

  getLastBackup(): BackupData | undefined {
    return this.backups[this.backups.length - 1];
  }

  clearBackups(): void {
    this.backups = [];
  }
}

