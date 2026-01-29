// ===== HISTORY LOG - Application Logging Service =====
export class HistoryLog {
    logs = [];
    nextId = 1;
    // add a new log entry with timestamp
    addLog(message) {
        const logEntry = {
            id: this.nextId++,
            message,
            timestamp: new Date(),
        };
        this.logs.push(logEntry);
    }
    // retrieve a copy of all log entries
    getLogs() {
        return [...this.logs];
    }
    // clear the array of log entries
    clearLogs() {
        this.logs = [];
    }
}
//# sourceMappingURL=HistoryLog.js.map