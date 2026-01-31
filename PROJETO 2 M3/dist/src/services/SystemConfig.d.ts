export declare class SystemConfig {
    private static config;
    static get(key: string): any;
    static set(key: string, value: any): void;
    static getInfo(): Record<string, any>;
    static reset(): void;
}
