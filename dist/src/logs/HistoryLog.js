// ===== HISTORY LOG - Application Logging Service =====
export class HistoryLog {
    logs = [];
    nextId = 1;
    addLog(message) {
        const logEntry = {
            id: this.nextId++,
            message,
            timestamp: new Date(),
        };
        this.logs.push(logEntry);
    }
    getLogs() {
        return [...this.logs];
    }
    clearLogs() {
        this.logs = [];
    }
}
//# sourceMappingURL=HistoryLog.js.map