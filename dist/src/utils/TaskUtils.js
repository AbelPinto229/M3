// Task utility functions for processing different task types
import { TaskStatus } from '../tasks/TaskStatus.js';
// Generic function that processes any task type differently
export function processTask(task) {
    const type = task.getType();
    switch (type) {
        case "bug":
            console.log(`[LOG] Processando bug: ${task.title}`);
            // Stricter rules for bugs
            if (task.status === TaskStatus.IN_PROGRESS) {
                console.warn(`Bug "${task.title}" em progresso!`);
            }
            if (task.status === TaskStatus.PENDING) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Bug "${task.title}" iniciado.`);
            }
            break;
        case "feature":
            console.log(`[LOG] Processando feature: ${task.title}`);
            // More flexible rules for features
            if (task.status === TaskStatus.PENDING) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Feature "${task.title}" em progresso.`);
            }
            break;
        case "task":
        default:
            console.log(`[LOG] Processando tarefa genérica: ${task.title}`);
            if (!task.completed) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Tarefa "${task.title}" em andamento.`);
            }
            break;
    }
}
//# sourceMappingURL=TaskUtils.js.map