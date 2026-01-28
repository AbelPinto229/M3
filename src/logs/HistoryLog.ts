// ===== HISTORY LOG - Application Logging Service =====

export interface LogEntry {
  id: number;
  message: string;
  timestamp: Date;
}

export class HistoryLog {
  private logs: LogEntry[] = [];
  private nextId = 1;

  // Add a new log entry with timestamp
  addLog(message: string): void {
    const logEntry: LogEntry = {
      id: this.nextId++,
      message,
      timestamp: new Date(),
    };
    this.logs.push(logEntry);
  }

  // Retrieve all log entries
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Clear all log entries
  clearLogs(): void {
    this.logs = [];
  }
}

