interface LogEntry {
    id: number;
    message: string;
    timestamp: Date;
}
export declare class SystemLogger {
    private static logs;
    private static nextId;
    static log(message: string): void;
    static getLogs(): LogEntry[];
    static clear(): void;
    static clearLogs(): void;
    static count(): number;
    static getLastN(n: number): string[];
}
export {};
