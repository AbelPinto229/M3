import { ITask } from '../tasks/ITask';
import { TaskStatus } from '../tasks/TaskStatus';
export declare class Task implements ITask {
    id: number;
    title: string;
    status: TaskStatus;
    constructor(title: string);
    getType(): string;
    moveTo(status: TaskStatus): void;
    get completed(): boolean;
}
export declare class BugTask extends Task {
    constructor(title: string);
    getType(): string;
}
export declare class FeatureTask extends Task {
    constructor(title: string);
    getType(): string;
}
