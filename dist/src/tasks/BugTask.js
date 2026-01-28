import { TaskStatus } from './TaskStatus.js';
export class BugTask {
    id;
    title;
    completed;
    status;
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.completed = false; // começa não concluída
        this.status = TaskStatus.PENDING; // status inicial
    }
    // Tipo específico da tarefa
    getType() {
        return "bug";
    }
    // Move a tarefa para outro estado com validação
    moveTo(newStatus) {
        const validTransitions = {
            [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS],
            [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED],
            [TaskStatus.COMPLETED]: []
        };
        // Verifica se a transição é permitida
        if (!validTransitions[this.status]?.includes(newStatus)) {
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
//# sourceMappingURL=BugTask.js.map