import { EntityList } from './EntityList.js';

// Favorites utility - manages favorite items
export class Favorites<T> extends EntityList<T> {
  // Check if item exists in favorites
  exists(item: T): boolean {
    return this.items.includes(item);
  }

  // Remove item from favorites
  remove(item: T): void {
    this.items = this.items.filter(i => i !== item);
  }
}
