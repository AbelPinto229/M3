// taskutils.ts
import { ITask } from './ITask.js';
import { TaskStatus } from './TaskStatus.js';

// Generic function that processes any task differently
export function processTask(task: ITask) {
    const type = task.getType();

    switch (type) {
        case "bug":
            console.log(`[LOG] Processing bug: ${task.title}`);
            // Stricter rules
            if (task.status === TaskStatus.PENDING) {
                console.warn(`Bug "${task.title}" is pending!`);
            }
            if (task.status === TaskStatus.PENDING) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Bug "${task.title}" started.`);
            }
            // Here you could trigger extra notifications
            break;

        case "feature":
            console.log(`[LOG] Processing feature: ${task.title}`);
            // More flexible rules
            if (task.status === TaskStatus.PENDING) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Feature "${task.title}" started.`);
            }
            break;

        case "task":
        default:
            console.log(`[LOG] Processing generic task: ${task.title}`);
            if (!task.completed) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Task "${task.title}" in progress.`);
            }
            break;
    }
}
