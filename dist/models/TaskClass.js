"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureTask = exports.BugTask = exports.Task = void 0;
const TaskStatus_1 = require("../tasks/TaskStatus");
// Gera IDs automáticos para as tarefas
let taskIdCounter = 1;
class Task {
    id; // obrigatório
    title;
    status;
    constructor(title) {
        this.id = taskIdCounter++; // atribui ID único
        this.title = title;
        this.status = TaskStatus_1.TaskStatus.CREATED;
    }
    getType() {
        return "task";
    }
    moveTo(status) {
        this.status = status;
    }
    get completed() {
        return this.status === TaskStatus_1.TaskStatus.COMPLETED;
    }
}
exports.Task = Task;
class BugTask extends Task {
    constructor(title) {
        super(title);
    }
    getType() {
        return "bug";
    }
}
exports.BugTask = BugTask;
class FeatureTask extends Task {
    constructor(title) {
        super(title);
    }
    getType() {
        return "feature";
    }
}
exports.FeatureTask = FeatureTask;
//# sourceMappingURL=TaskClass.js.map