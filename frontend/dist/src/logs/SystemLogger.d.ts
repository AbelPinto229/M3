interface LogEntry {
    id: number;
    message: string;
    timestamp: Date;
    created_at?: string;
}
export declare class SystemLogger {
    private static logs;
    private static loaded;
    static loadLogs(): Promise<void>;
    static log(message: string): void;
    static getLogs(): LogEntry[];
    static clear(): void;
    static clearLogs(): void;
    static count(): number;
    static getLastN(n: number): string[];
}
export {};
