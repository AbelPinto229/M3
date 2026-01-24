import { ITask } from './ITask';
import { TaskStatus } from './TaskStatus';

// Função genérica que processa qualquer tarefa de forma diferente
export function processTask(task: ITask) {
    const type = task.getType();

    switch (type) {
        case "bug":
            console.log(`[LOG] Processando bug: ${task.title}`);
            // regras mais rígidas
            if (task.status === TaskStatus.BLOCKED) {
                console.warn(`Bug "${task.title}" está bloqueado!`);
            }
            // exemplo: tenta mover para IN_PROGRESS se estiver ASSIGNED
            if (task.status === TaskStatus.ASSIGNED) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Bug "${task.title}" iniciado.`);
            }
            // aqui você poderia disparar notificações extras
            break;

        case "feature":
            console.log(`[LOG] Processando feature: ${task.title}`);
            // regras mais flexíveis
            if (task.status === TaskStatus.CREATED) {
                task.moveTo(TaskStatus.ASSIGNED);
                console.log(`Feature "${task.title}" atribuída.`);
            }
            break;

        case "task":
        default:
            console.log(`[LOG] Processando tarefa genérica: ${task.title}`);
            // comportamento genérico
            if (!task.completed) {
                task.moveTo(TaskStatus.IN_PROGRESS);
                console.log(`Tarefa "${task.title}" em andamento.`);
            }
            break;
    }
}
