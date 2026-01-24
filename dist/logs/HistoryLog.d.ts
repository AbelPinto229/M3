export declare class HistoryLog {
    private logs;
    /**
     * Adiciona uma mensagem ao histórico com timestamp
     * @param message - mensagem de log
     */
    addLog(message: string): void;
    /**
     * Retorna todos os logs registrados
     */
    getLogs(): string[];
    /**
     * Limpa todo o histórico
     */
    clearLogs(): void;
}
