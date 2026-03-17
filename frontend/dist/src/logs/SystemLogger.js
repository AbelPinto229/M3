// Logger global do sistema (integra HistoryLog)
export class SystemLogger {
    // Armazenamento privado de logs
    static logs = [];
    static nextId = 1;
    // Registar mensagem no log
    static log(message) {
        const logEntry = {
            id: SystemLogger.nextId++,
            message,
            timestamp: new Date(),
        };
        SystemLogger.logs.push(logEntry);
    }
    // Obter todos os logs
    static getLogs() {
        return [...SystemLogger.logs];
    }
    // Limpar logs
    static clear() {
        SystemLogger.logs = [];
        SystemLogger.nextId = 1;
    }
    // Compatibilidade: alias para clear
    static clearLogs() {
        SystemLogger.clear();
    }
    // Obter quantidade de logs
    static count() {
        return SystemLogger.logs.length;
    }
    // Obter últimos N logs
    static getLastN(n) {
        return SystemLogger.logs.slice(-n).map((log) => {
            const time = log.timestamp instanceof Date
                ? log.timestamp.toLocaleTimeString('pt-PT')
                : new Date(log.timestamp).toLocaleTimeString('pt-PT');
            return `[${time}] ${log.message}`;
        });
    }
}
//# sourceMappingURL=SystemLogger.js.map