"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityService = exports.Priority = void 0;
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["CRITICAL"] = "CRITICAL";
})(Priority || (exports.Priority = Priority = {}));
class PriorityService {
    priorities = new Map();
    setPriority(taskId, priority) {
        this.priorities.set(taskId, priority);
    }
    getPriority(taskId) {
        return this.priorities.get(taskId);
    }
    getHighPriorityTasks() {
        const result = [];
        this.priorities.forEach((priority, taskId) => {
            if (priority === Priority.HIGH || priority === Priority.CRITICAL)
                result.push(taskId);
        });
        return result;
    }
}
exports.PriorityService = PriorityService;
//# sourceMappingURL=PriorityService.js.map