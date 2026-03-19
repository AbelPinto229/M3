// Interface para log entries
interface LogEntry {
    id: number;
    message: string;
    timestamp: Date;
    created_at?: string;
}

const LOG_API = 'http://localhost:3000/logs';

// Logger global do sistema (integra HistoryLog) - persiste na DB via API
export class SystemLogger {
    // Cache local para não precisar chamar API em cada render
    private static logs: LogEntry[] = [];
    private static loaded: boolean = false;

    // Carregar logs da API
    static async loadLogs(): Promise<void> {
        try {
            const res = await fetch(LOG_API);
            if (res.ok) {
                const data = await res.json();
                SystemLogger.logs = data.map((l: any) => ({
                    id: l.id,
                    message: l.message,
                    timestamp: new Date(l.created_at)
                }));
                SystemLogger.loaded = true;
            }
        } catch (e) {
            console.error('Erro ao carregar logs:', e);
        }
    }

    // Registar mensagem no log (envia para API + guarda local)
    static log(message: string): void {
        // Guardar localmente de imediato para UI responsiva
        const logEntry: LogEntry = {
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
        }).catch(() => {});
    }

    // Obter todos os logs
    static getLogs(): LogEntry[] {
        return [...SystemLogger.logs];
    }

    // Limpar logs
    static clear(): void {
        SystemLogger.logs = [];
        fetch(LOG_API, { method: 'DELETE' }).catch(() => {});
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
