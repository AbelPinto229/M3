// GENERIC TAG MANAGER - Reusable tag management for any entity
export class TagManager<T> {
  private tags: Map<T, string[]> = new Map();

  addTag(item: T, tag: string): void {
    if (!this.tags.has(item)) {
      this.tags.set(item, []);
    }
    const itemTags = this.tags.get(item)!;
    if (!itemTags.includes(tag)) {
      itemTags.push(tag);
    }
  }

  removeTag(item: T, tag: string): void {
    const itemTags = this.tags.get(item);
    if (itemTags) {
      const index = itemTags.indexOf(tag);
      if (index > -1) {
        itemTags.splice(index, 1);
      }
    }
  }

  getTags(item: T): string[] {
    return this.tags.get(item) || [];
  }
}
