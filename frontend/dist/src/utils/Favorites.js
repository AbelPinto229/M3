import { EntityList } from './EntityList.js';
// Favorites utility - manages favorite items
export class Favorites extends EntityList {
    // Check if item exists in favorites
    exists(item) {
        return this.items.includes(item);
    }
    // Remove item from favorites
    remove(item) {
        this.items = this.items.filter(i => i !== item);
    }
}
//# sourceMappingURL=Favorites.js.map