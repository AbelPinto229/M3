// ===== HISTORY LOG - Application Logging Service =====
export class HistoryLog {
  private logs: any[] = [];
  private nextId = 1;

  // add a new log entry with timestamp
  addLog(message: string): void {
    const logEntry = {
      id: this.nextId++,
      message,
      timestamp: new Date(),
    };
    this.logs.push(logEntry);
  }

  // retrieve a copy of all log entries
  getLogs(): any[] {
    return [...this.logs];
  }

  // clear the array of log entries
  clearLogs(): void {
    this.logs = [];
  }
}

