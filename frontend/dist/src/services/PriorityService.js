// PRIORITY SERVICE - Task priorities
export var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["CRITICAL"] = "CRITICAL";
})(Priority || (Priority = {}));
export class PriorityService {
    priorities = new Map();
    // set priority for a task
    setPriority(taskId, priority) {
        this.priorities.set(taskId, priority);
    }
    // get priority for a task
    getPriority(taskId) {
        return this.priorities.get(taskId);
    }
    // get all high priority tasks (HIGH and CRITICAL)
    getHighPriorityTasks() {
        const result = [];
        this.priorities.forEach((priority, taskId) => {
            if (priority === Priority.HIGH || priority === Priority.CRITICAL)
                result.push(taskId);
        });
        return result;
    }
    // remove priority of a task
    removePriority(taskId) {
        return this.priorities.delete(taskId);
    }
    // clear all priorities
    clear() {
        this.priorities.clear();
    }
}
//# sourceMappingURL=PriorityService.js.map