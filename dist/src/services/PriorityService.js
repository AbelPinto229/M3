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
    // Set priority for a task
    setPriority(taskId, priority) {
        this.priorities.set(taskId, priority);
    }
    // Get priority for a task
    getPriority(taskId) {
        return this.priorities.get(taskId);
    }
    // Get all high priority tasks (HIGH and CRITICAL)
    getHighPriorityTasks() {
        const result = [];
        this.priorities.forEach((priority, taskId) => {
            if (priority === Priority.HIGH || priority === Priority.CRITICAL)
                result.push(taskId);
        });
        return result;
    }
    // Filter tasks by priority
    getTasksByPriority(tasks, priority) {
        return tasks.filter(t => t.priority === priority);
    }
    // Get all available priority levels
    getPriorities() {
        return ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    }
    // Sort tasks by priority (CRITICAL > HIGH > MEDIUM > LOW)
    sortTasksByPriority(tasks) {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return [...tasks].sort((a, b) => (priorityOrder[a.priority] || 3) -
            (priorityOrder[b.priority] || 3));
    }
}
//# sourceMappingURL=PriorityService.js.map