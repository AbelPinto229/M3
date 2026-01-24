"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureTask = void 0;
const TaskStatus_js_1 = require("./TaskStatus.js");
class FeatureTask {
    id;
    title;
    completed;
    status;
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.completed = false;
        this.status = TaskStatus_js_1.TaskStatus.CREATED;
    }
    getType() {
        return "feature";
    }
    moveTo(newStatus) {
        this.status = newStatus;
        if (newStatus === TaskStatus_js_1.TaskStatus.COMPLETED) {
            this.completed = true;
        }
    }
}
exports.FeatureTask = FeatureTask;
//# sourceMappingURL=FeatureTask.js.map