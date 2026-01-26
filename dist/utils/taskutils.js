"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTask = processTask;
const TaskStatus_1 = require("../tasks/TaskStatus");
// Função genérica que processa qualquer tarefa de forma diferente
function processTask(task) {
    const type = task.getType();
    switch (type) {
        case "bug":
            console.log(`[LOG] Processando bug: ${task.title}`);
            if (task.status === TaskStatus_1.TaskStatus.BLOCKED)
                console.warn(`Bug "${task.title}" está bloqueado!`);
            if (task.status === TaskStatus_1.TaskStatus.ASSIGNED) {
                task.moveTo(TaskStatus_1.TaskStatus.IN_PROGRESS);
                console.log(`Bug "${task.title}" iniciado.`);
            }
            break;
        case "feature":
            console.log(`[LOG] Processando feature: ${task.title}`);
            if (task.status === TaskStatus_1.TaskStatus.CREATED) {
                task.moveTo(TaskStatus_1.TaskStatus.ASSIGNED);
                console.log(`Feature "${task.title}" atribuída.`);
            }
            break;
        case "task":
        default:
            console.log(`[LOG] Processando tarefa genérica: ${task.title}`);
            if (!task.completed) {
                task.moveTo(TaskStatus_1.TaskStatus.IN_PROGRESS);
                console.log(`Tarefa "${task.title}" em andamento.`);
            }
            break;
    }
}
//# sourceMappingURL=taskutils.js.map