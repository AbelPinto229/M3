"use strict";
// src/logs/HistoryLog.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryLog = void 0;
class HistoryLog {
    // Armazena as mensagens do histórico
    logs = [];
    /**
     * Adiciona uma mensagem ao histórico com timestamp
     * @param message - mensagem de log
     */
    addLog(message) {
        const timestamp = new Date().toISOString();
        this.logs.push(`[${timestamp}] ${message}`);
    }
    /**
     * Retorna todos os logs registrados
     */
    getLogs() {
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
exports.HistoryLog = HistoryLog;
//# sourceMappingURL=HistoryLog.js.map