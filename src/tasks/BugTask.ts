import { ITask } from './ITask.js';
import { TaskStatus } from './TaskStatus.js';

export class BugTask implements ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        this.completed = false;        // starts not completed
        this.status = TaskStatus.PENDING; // initial status
    }

    // Specific type of the task
    getType(): string {
        return "bug";
    }

    // Moves the task to another state with validation
    moveTo(newStatus: TaskStatus): void {
        const validTransitions: Record<string, string[]> = {
            [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS],
            [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED],
            [TaskStatus.COMPLETED]: []
        };

        // Checks if the transition is allowed
        if (!validTransitions[this.status]?.includes(newStatus)) {
            throw new Error(`Invalid transition from ${this.status} to ${newStatus}`);
        }

        // Updates the status
        this.status = newStatus;

        // If reached COMPLETED, marks as completed
        if (newStatus === TaskStatus.COMPLETED) {
            this.completed = true;
        }
    }
}
