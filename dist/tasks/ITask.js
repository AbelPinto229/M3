"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDeadline = setDeadline;
exports.isExpired = isExpired;
exports.getExpiredTasks = getExpiredTasks;
/*
Dicas (como implementar):
*/
//Começa por pensar: “Onde vou guardar os deadlines?”
//Cria uma estrutura privada dentro do service (ex: um Map ou objeto)
const deadlines = new Map();
//Usa taskId como chave e date como valor
//Implementa primeiro apenas o armazenamento (setDeadline)
//Depois implementa a lógica de tempo (comparar datas)
//Converte datas para números (timestamp) para facilitar comparações
//Cria uma função auxiliar para obter a data atual 
function setDeadline(taskID, date) {
    deadlines.set(taskID, date);
}
//isExpired(taskId) deve:
//→ buscar a data
//→ comparar com o tempo atual
//→ devolver true/false
function isExpired(taskID) {
    const deadline = deadlines.get(taskID);
    if (!deadline)
        return false;
    const now = new Date();
    return now.getTime() > deadline.getTime();
}
//getExpiredTasks() deve:
//→ percorrer todos os deadlines
//→ filtrar os expirados
//→ devolver apenas os taskIds ou tasks
//Implementa por etapas: guardar → comparar → filtrar → devolver 
function getExpiredTasks() {
    const now = new Date();
    const expiredTasks = [];
    for (const [taskID, deadline] of deadlines.entries()) {
        if (now.getTime() > deadline.getTime()) {
            expiredTasks.push(taskID);
        }
    }
    return expiredTasks;
}
//# sourceMappingURL=ITask.js.map