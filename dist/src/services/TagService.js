export class TagService {
    tags = new Map();
    addTag(taskId, tag) {
        if (!this.tags.has(taskId))
            this.tags.set(taskId, new Set());
        this.tags.get(taskId)?.add(tag);
    }
    removeTag(taskId, tag) {
        this.tags.get(taskId)?.delete(tag);
    }
    getTags(taskId) {
        return Array.from(this.tags.get(taskId) || []);
    }
    getTasksByTag(tag) {
        const result = [];
        this.tags.forEach((tagsSet, taskId) => {
            if (tagsSet.has(tag))
                result.push(taskId);
        });
        return result;
    }
}
//# sourceMappingURL=TagService.js.map