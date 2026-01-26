import { TaskStatus } from './TaskStatus.js';
export interface ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;
    getType(): string;
    moveTo(status: TaskStatus): void;
}
export declare function setDeadline(taskID: number, date: Date): void;
export declare function isExpired(taskID: number): boolean;
export declare function getExpiredTasks(): number[];
