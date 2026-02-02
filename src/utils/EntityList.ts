// Generic EntityList class to manage a list of entities
export class EntityList<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
  }
}
