export interface LogEntry {
    id: number;
    message: string;
    timestamp: Date;
}
export declare class HistoryLog {
    private logs;
    private nextId;
    addLog(message: string): void;
    getLogs(): LogEntry[];
    clearLogs(): void;
}
