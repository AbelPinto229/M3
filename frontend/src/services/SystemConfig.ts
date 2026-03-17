// Configuração global do sistema (Exercício 2)
export class SystemConfig {
    private static config: Record<string, any> = {
        appName: 'Project M3 System',
        version: '1.0.0',
        environment: 'production',
        maxUsers: 1000,
        maxTasks: 5000,
        debugMode: false,
        apiUrl: 'https://api.example.com',
        timezone: 'Europe/Lisbon'
    };

    // Obter uma configuração específica
    static get(key: string): any {
        return SystemConfig.config[key];
    }

    // Definir uma configuração
    static set(key: string, value: any): void {
        SystemConfig.config[key] = value;
    }

    // Obter toda a configuração
    static getInfo(): Record<string, any> {
        return { ...SystemConfig.config };
    }

    // Resetar para valores padrão
    static reset(): void {
        SystemConfig.config = {
            appName: 'Project M3 System',
            version: '1.0.0',
            environment: 'production',
            maxUsers: 1000,
            maxTasks: 5000,
            debugMode: false,
            apiUrl: 'https://api.example.com',
            timezone: 'Europe/Lisbon'
        };
    }
}
