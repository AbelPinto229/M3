// Configuração global do sistema (Exercício 2)
export class SystemConfig {
    static config = {
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
    static get(key) {
        return SystemConfig.config[key];
    }
    // Definir uma configuração
    static set(key, value) {
        SystemConfig.config[key] = value;
    }
    // Obter toda a configuração
    static getInfo() {
        return { ...SystemConfig.config };
    }
    // Resetar para valores padrão
    static reset() {
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
//# sourceMappingURL=SystemConfig.js.map