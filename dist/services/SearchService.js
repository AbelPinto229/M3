"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
class SearchService {
    tasks;
    constructor(tasks) {
        this.tasks = tasks;
    }
    searchByTitle(text) {
        return this.tasks.filter(t => t.title.toLowerCase().includes(text.toLowerCase()));
    }
    searchByUser(userId, assignmentService) {
        const taskIds = assignmentService.getTasksFromUser(userId);
        return this.tasks.filter(t => taskIds.includes(t.id));
    }
    searchByStatus(status) {
        return this.tasks.filter(t => t.status === status);
    }
    globalSearch(query, assignmentService) {
        const byTitle = this.searchByTitle(query);
        const byStatus = this.searchByStatus(query);
        // assume query numérica para userId
        const userId = Number(query);
        const byUser = isNaN(userId) ? [] : this.searchByUser(userId, assignmentService);
        const all = [...byTitle, ...byStatus, ...byUser];
        return Array.from(new Set(all)); // remove duplicados
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=SearchService.js.map