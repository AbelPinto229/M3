import { EntityList } from '../utils/EntityList.js';
export declare class HistoryLog extends EntityList<any> {
    private nextId;
    addLog(message: string): void;
    getLogs(): any[];
    clearLogs(): void;
}
