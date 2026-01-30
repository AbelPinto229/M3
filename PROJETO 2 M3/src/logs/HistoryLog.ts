import { EntityList } from '../utils/EntityList.js';

// ===== HISTORY LOG - Application Logging Service =====
export class HistoryLog extends EntityList<any> {
  private nextId = 1;

  // add a new log entry with timestamp
  addLog(message: string): void {
    const logEntry = {
      id: this.nextId++,
      message,
      timestamp: new Date(),
    };
    this.add(logEntry);
  }

  // retrieve a copy of all log entries
  getLogs(): any[] {
    return [...this.getAll()];
  }

  // clear the array of log entries
  clearLogs(): void {
    this.clear();
  }
}

