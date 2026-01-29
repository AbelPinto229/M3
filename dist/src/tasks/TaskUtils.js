import { TaskStatus } from './TaskStatus.js';
// function that processes any task differently
export function processTask(task) {
    const type = task.getType();
    switch (type) {
        case "bug":
            console.log(`[LOG] Processing bug: ${task.title}`);
            // check the status and throw a warning in console
            if (task.status === TaskStatus.ASSIGNED) {
                console.warn(`Bug "${task.title}" is assigned!`);
            }
            if (task.status === TaskStatus.ASSIGNED) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Bug "${task.title}" started.`);
            }
            break;
        case "feature":
            console.log(`[LOG] Processing feature: ${task.title}`);
            // check the status and throw a warning in console
            if (task.status === TaskStatus.ASSIGNED) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Feature "${task.title}" started.`);
            }
            break;
        case "task":
        default:
            console.log(`[LOG] Processing generic task: ${task.title}`);
            // check the status and throw a warning in console
            if (!task.completed && task.status === TaskStatus.ASSIGNED) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Task "${task.title}" in progress.`);
            }
            break;
    }
}
//# sourceMappingURL=TaskUtils.js.map