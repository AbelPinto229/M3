// src/tasks/ITask.ts
import { TaskStatus } from './TaskStatus';

export interface ITask {
    id: number;               // ID único da tarefa
    title: string;            // Título da tarefa
    completed: boolean;       // Se a tarefa está concluída
    status: TaskStatus;       // Estado atual da tarefa

    // Retorna o tipo da tarefa (ex: "Simples", "Bug", "Feature")
    getType(): string;

    // Altera o estado da tarefa
    moveTo(status: TaskStatus): void;
}
