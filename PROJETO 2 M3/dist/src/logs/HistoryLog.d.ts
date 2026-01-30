export declare class HistoryLog {
    private logs;
    private nextId;
    addLog(message: string): void;
    getLogs(): any[];
    clearLogs(): void;
}
