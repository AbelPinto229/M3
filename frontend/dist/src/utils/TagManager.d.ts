export declare class TagManager<T> {
    private tags;
    addTag(item: T, tag: string): void;
    removeTag(item: T, tag: string): void;
    getTags(item: T): string[];
}
