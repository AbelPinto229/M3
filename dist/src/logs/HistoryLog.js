// ===== HISTORY LOG - Application Logging Service =====
export class HistoryLog {
    logs = [];
    nextId = 1;
    // Add a new log entry with timestamp
    addLog(message) {
        const logEntry = {
            id: this.nextId++,
            message,
            timestamp: new Date(),
        };
        this.logs.push(logEntry);
    }
    // Retrieve all log entries
    getLogs() {
        return [...this.logs];
    }
    // Clear all log entries
    clearLogs() {
        this.logs = [];
    }
}
//# sourceMappingURL=HistoryLog.js.map