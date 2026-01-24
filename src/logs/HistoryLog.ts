// src/logs/HistoryLog.ts

export class HistoryLog {
    // Armazena as mensagens do histórico
    private logs: string[] = [];

    /**
     * Adiciona uma mensagem ao histórico com timestamp
     * @param message - mensagem de log
     */
    addLog(message: string) {
        const timestamp = new Date().toISOString();
        this.logs.push(`[${timestamp}] ${message}`);
    }

    /**
     * Retorna todos os logs registrados
     */
    getLogs(): string[] {
        // devolve uma cópia para evitar alteração externa
        return [...this.logs];
    }

    /**
     * Limpa todo o histórico
     */
    clearLogs() {
        this.logs = [];
    }
}
