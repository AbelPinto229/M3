import { ITask } from './ITask.js';
import { TaskStatus } from './TaskStatus.js';
export declare class BugTask implements ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;
    constructor(id: number, title: string);
    getType(): string;
    moveTo(newStatus: TaskStatus): void;
}
