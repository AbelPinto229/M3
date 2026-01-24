import { ITask } from './ITask';
import { TaskStatus } from './TaskStatus';

export class BugTask implements ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        this.completed = false;        // começa não concluída
        this.status = TaskStatus.CREATED; // status inicial
    }

    // Tipo específico da tarefa
    getType(): string {
        return "bug";
    }

    // Move a tarefa para outro estado com validação
    moveTo(newStatus: TaskStatus): void {
        const validTransitions: Record<TaskStatus, TaskStatus[]> = {
            [TaskStatus.CREATED]: [TaskStatus.ASSIGNED],
            [TaskStatus.ASSIGNED]: [TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED],
            [TaskStatus.IN_PROGRESS]: [TaskStatus.BLOCKED, TaskStatus.COMPLETED],
            [TaskStatus.BLOCKED]: [TaskStatus.IN_PROGRESS, TaskStatus.ARCHIVED],
            [TaskStatus.COMPLETED]: [TaskStatus.ARCHIVED],
            [TaskStatus.ARCHIVED]: []
        };

        // Verifica se a transição é permitida
        if (!validTransitions[this.status].includes(newStatus)) {
            throw new Error(`Transição inválida de ${this.status} para ${newStatus}`);
        }

        // Atualiza o status
        this.status = newStatus;

        // Se chegou a COMPLETED, marca como concluída
        if (newStatus === TaskStatus.COMPLETED) {
            this.completed = true;
        }
    }
}
