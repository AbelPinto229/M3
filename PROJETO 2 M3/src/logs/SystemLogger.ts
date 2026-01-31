// Interface para log entries
interface LogEntry {
    id: number;
    message: string;
    timestamp: Date;
}

// Logger global do sistema (integra HistoryLog)
export class SystemLogger {
    // Armazenamento privado de logs
    private static logs: LogEntry[] = [];
    private static nextId: number = 1;

    // Registar mensagem no log
    static log(message: string): void {
        const logEntry: LogEntry = {
            id: SystemLogger.nextId++,
            message,
            timestamp: new Date(),
        };
        SystemLogger.logs.push(logEntry);
    }

    // Obter todos os logs
    static getLogs(): LogEntry[] {
        return [...SystemLogger.logs];
    }

    // Limpar logs
    static clear(): void {
        SystemLogger.logs = [];
        SystemLogger.nextId = 1;
    }

    // Compatibilidade: alias para clear
    static clearLogs(): void {
        SystemLogger.clear();
    }

    // Obter quantidade de logs
    static count(): number {
        return SystemLogger.logs.length;
    }

    // Obter últimos N logs
    static getLastN(n: number): string[] {
        return SystemLogger.logs.slice(-n).map((log: LogEntry) => {
            const time = log.timestamp instanceof Date 
                ? log.timestamp.toLocaleTimeString('pt-PT')
                : new Date(log.timestamp).toLocaleTimeString('pt-PT');
            return `[${time}] ${log.message}`;
        });
    }
}
