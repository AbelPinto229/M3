import { TaskStatus } from './TaskStatus.js';
// Função genérica que processa qualquer tarefa de forma diferente
export function processTask(task) {
    const type = task.getType();
    switch (type) {
        case "bug":
            console.log(`[LOG] Processando bug: ${task.title}`);
            // Regras mais rígidas
            if (task.status === TaskStatus.PENDING) {
                console.warn(`Bug "${task.title}" está pendente!`);
            }
            if (task.status === TaskStatus.PENDING) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Bug "${task.title}" iniciado.`);
            }
            // Aqui você poderia disparar notificações extras
            break;
        case "feature":
            console.log(`[LOG] Processando feature: ${task.title}`);
            // Regras mais flexíveis
            if (task.status === TaskStatus.PENDING) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Feature "${task.title}" iniciada.`);
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