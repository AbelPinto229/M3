// GENERIC TAG MANAGER - Reusable tag management for any entity
export class TagManager {
    tags = new Map();
    addTag(item, tag) {
        if (!this.tags.has(item)) {
            this.tags.set(item, []);
        }
        const itemTags = this.tags.get(item);
        if (!itemTags.includes(tag)) {
            itemTags.push(tag);
        }
    }
    removeTag(item, tag) {
        const itemTags = this.tags.get(item);
        if (itemTags) {
            const index = itemTags.indexOf(tag);
            if (index > -1) {
                itemTags.splice(index, 1);
            }
        }
    }
    getTags(item) {
        return this.tags.get(item) || [];
    }
}
//# sourceMappingURL=TagManager.js.map