// Utility class to manage favorite items
export class Favorites {
    items = [];
    add(item) {
        this.items.push(item);
    }
    remove(item) {
        this.items = this.items.filter(i => i !== item);
    }
    exists(item) {
        return this.items.includes(item);
    }
    getAll() {
        return this.items;
    }
}
//# sourceMappingURL=Favorites.js.map