"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugTask = void 0;
const TaskStatus_js_1 = require("./TaskStatus.js");
class BugTask {
    id;
    title;
    completed;
    status;
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.completed = false; // começa não concluída
        this.status = TaskStatus_js_1.TaskStatus.CREATED; // status inicial
    }
    // Tipo específico da tarefa
    getType() {
        return "bug";
    }
    // Move a tarefa para outro estado com validação
    moveTo(newStatus) {
        const validTransitions = {
            [TaskStatus_js_1.TaskStatus.CREATED]: [TaskStatus_js_1.TaskStatus.ASSIGNED],
            [TaskStatus_js_1.TaskStatus.ASSIGNED]: [TaskStatus_js_1.TaskStatus.IN_PROGRESS, TaskStatus_js_1.TaskStatus.BLOCKED],
            [TaskStatus_js_1.TaskStatus.IN_PROGRESS]: [TaskStatus_js_1.TaskStatus.BLOCKED, TaskStatus_js_1.TaskStatus.COMPLETED],
            [TaskStatus_js_1.TaskStatus.BLOCKED]: [TaskStatus_js_1.TaskStatus.IN_PROGRESS, TaskStatus_js_1.TaskStatus.ARCHIVED],
            [TaskStatus_js_1.TaskStatus.COMPLETED]: [TaskStatus_js_1.TaskStatus.ARCHIVED],
            [TaskStatus_js_1.TaskStatus.ARCHIVED]: []
        };
        // Verifica se a transição é permitida
        if (!validTransitions[this.status].includes(newStatus)) {
            throw new Error(`Transição inválida de ${this.status} para ${newStatus}`);
        }
        // Atualiza o status
        this.status = newStatus;
        // Se chegou a COMPLETED, marca como concluída
        if (newStatus === TaskStatus_js_1.TaskStatus.COMPLETED) {
            this.completed = true;
        }
    }
}
exports.BugTask = BugTask;
//# sourceMappingURL=BugTask.js.map