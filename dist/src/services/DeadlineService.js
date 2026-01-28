// DEADLINE SERVICE - Deadline tracking
export class DeadlineService {
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
//# sourceMappingURL=DeadlineService.js.map