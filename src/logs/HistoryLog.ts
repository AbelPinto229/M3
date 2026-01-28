// ===== HISTORY LOG - Application Logging Service =====

export interface LogEntry {
  id: number;
  message: string;
  timestamp: Date;
}

export class HistoryLog {
  private logs: LogEntry[] = [];
  private nextId = 1;

  addLog(message: string): void {
    const logEntry: LogEntry = {
      id: this.nextId++,
      message,
      timestamp: new Date(),
    };
    this.logs.push(logEntry);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

