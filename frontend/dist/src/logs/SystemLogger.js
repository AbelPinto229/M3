const LOG_API = 'http://localhost:3000/logs';
// Logger global do sistema (integra HistoryLog) - persiste na DB via API
export class SystemLogger {
    // Cache local para não precisar chamar API em cada render
    static logs = [];
    static loaded = false;
    // Carregar logs da API
    static async loadLogs() {
        try {
            const res = await fetch(LOG_API);
            if (res.ok) {
                const data = await res.json();
                SystemLogger.logs = data.map((l) => ({
                    id: l.id,
                    message: l.message,
                    timestamp: new Date(l.created_at)
                }));
                SystemLogger.loaded = true;
            }
        }
        catch (e) {
            console.error('Erro ao carregar logs:', e);
        }
    }
    // Registar mensagem no log (envia para API + guarda local)
    static log(message) {
        // Guardar localmente de imediato para UI responsiva
        const logEntry = {
            id: Date.now(),
            message,
            timestamp: new Date(),
        };
        SystemLogger.logs.push(logEntry);
        // Enviar para API em background (fire-and-forget)
        fetch(LOG_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        }).catch(() => { });
    }
    // Obter todos os logs
    static getLogs() {
        return [...SystemLogger.logs];
    }
    // Limpar logs
    static clear() {
        SystemLogger.logs = [];
        fetch(LOG_API, { method: 'DELETE' }).catch(() => { });
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