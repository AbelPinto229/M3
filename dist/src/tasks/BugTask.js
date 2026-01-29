import { TaskStatus } from './TaskStatus.js';
export class BugTask {
    id;
    title;
    completed;
    status;
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.completed = false; // starts not completed
        this.status = TaskStatus.CREATED; // initial status
    }
    // identify the type, here "bug"
    getType() {
        return "bug";
    }
    // moves the task to another state with validation
    moveTo(newStatus) {
        const validTransitions = {
            [TaskStatus.CREATED]: [TaskStatus.ASSIGNED],
            [TaskStatus.ASSIGNED]: [TaskStatus.IN_PROGRESS],
            [TaskStatus.IN_PROGRESS]: [TaskStatus.BLOCKED, TaskStatus.COMPLETED],
            [TaskStatus.BLOCKED]: [TaskStatus.IN_PROGRESS],
            [TaskStatus.COMPLETED]: [TaskStatus.ARCHIVED],
            [TaskStatus.ARCHIVED]: []
        };
        // checks if the transition is allowed, have to follow the order, other show error
        if (!validTransitions[this.status]?.includes(newStatus)) {
            throw new Error(`Invalid transition from ${this.status} to ${newStatus}`);
        }
        // updates the status after validation
        this.status = newStatus;
        // if reached ARCHIVED (final status), marks as completed
        if (newStatus === TaskStatus.ARCHIVED) {
            this.completed = true;
        }
    }
}
//# sourceMappingURL=BugTask.js.map