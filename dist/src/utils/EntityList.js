// Generic EntityList class to manage a list of entities
export class EntityList {
    items = [];
    add(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
    clear() {
        this.items = [];
    }
}
//# sourceMappingURL=EntityList.js.map