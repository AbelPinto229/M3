// TAG SERVICE - Manages task tags and categorization
export class TagService {
    // create a map with task IDs as keys and sets of tags as values
    tags = new Map();
    // adds a tag to a task
    addTag(taskId, tag) {
        if (!this.tags.has(taskId))
            this.tags.set(taskId, new Set());
        this.tags.get(taskId)?.add(tag);
    }
    // removes a tag from a task
    removeTag(taskId, tag) {
        this.tags.get(taskId)?.delete(tag);
    }
    // retrieves all tags for a specific task
    getTags(taskId) {
        return Array.from(this.tags.get(taskId) || []);
    }
    // retrieves all task IDs that have a specific tag
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