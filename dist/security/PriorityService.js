"use strict";
/*Dicas (como implementar):
- Primeiro cria o enum Priority (num ficheiro separado)
- Depois pensa: “Onde guardo a prioridade?”
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = void 0;
exports.setPriority = setPriority;
exports.getPriority = getPriority;
exports.getHighPriorityTasks = getHighPriorityTasks;
var Priority;
(function (Priority) {
    Priority["High"] = "HIGH";
    Priority["Critical"] = "CRITICAL";
})(Priority || (exports.Priority = Priority = {}));
//- Cria uma estrutura Map(taskId → priority)
const priority = new Map();
//- setPriority deve apenas guardar o valor
function setPriority(taskID, prio) {
    priority.set(taskID, prio);
}
//- getPriority deve apenas ler o valor
function getPriority(taskID) {
    return priority.get(taskID);
}
/*- getHighPriorityTasks deve:→ percorrer todas as prioridades
→ filtrar por HIGH e CRITICAL
→ devolver os ids ou tasks
- Implementa por fases:
1) enum
2) storage
3) set
4) get
5) filtro
*/
function getHighPriorityTasks() {
    const highPriorityTasks = [];
    for (const [taskID, prio] of priority.entries()) {
        if (prio === Priority.High || prio === Priority.Critical) {
            highPriorityTasks.push(taskID);
        }
    }
    return highPriorityTasks;
}
//# sourceMappingURL=PriorityService.js.map