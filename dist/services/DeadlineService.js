"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadlineService = void 0;
class DeadlineService {
    deadlines = new Map();
    setDeadline(taskId, date) {
        this.deadlines.set(taskId, date);
    }
    isExpired(taskId) {
        const deadline = this.deadlines.get(taskId);
        if (!deadline)
            return false;
        return deadline.getTime() < Date.now();
    }
    getExpiredTasks() {
        const expired = [];
        this.deadlines.forEach((date, taskId) => {
            if (date.getTime() < Date.now())
                expired.push(taskId);
        });
        return expired;
    }
}
exports.DeadlineService = DeadlineService;
//# sourceMappingURL=DeadlineService.js.map