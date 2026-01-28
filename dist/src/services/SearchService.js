export class SearchService {
    tasks;
    constructor(tasks) {
        this.tasks = tasks;
    }
    searchByTitle(text) {
        return this.tasks.filter((t) => t.title.toLowerCase().includes(text.toLowerCase()));
    }
    searchByUser(userId, assignmentService) {
        const taskIds = assignmentService.getTasksFromUser(userId);
        return this.tasks.filter((t) => taskIds.includes(t.id));
    }
    searchByStatus(status) {
        return this.tasks.filter((t) => t.status === status);
    }
    globalSearch(query, assignmentService) {
        const byTitle = this.searchByTitle(query);
        const byStatus = this.searchByStatus(query);
        // assume query numérica para userId
        const userId = Number(query);
        const byUser = isNaN(userId)
            ? []
            : this.searchByUser(userId, assignmentService);
        const all = [...byTitle, ...byStatus, ...byUser];
        return Array.from(new Set(all)); // remove duplicados
    }
    filterTasks(tasks, criteria, tagService) {
        return tasks.filter(task => {
            const matchTitle = task.title.toLowerCase().includes(criteria.text.toLowerCase());
            const matchStatus = criteria.status === "" || task.status === criteria.status;
            const matchPriority = criteria.priority === "" || task.priority === criteria.priority;
            const matchType = criteria.type === "" || task.type === criteria.type;
            const taskTags = tagService.getTags(task.id);
            const matchTag = criteria.tag === "" || taskTags.some(t => t.includes(criteria.tag.toLowerCase()));
            return matchTitle && matchStatus && matchPriority && matchType && matchTag;
        });
    }
}
//# sourceMappingURL=SearchService.js.map