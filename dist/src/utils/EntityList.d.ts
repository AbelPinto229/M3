export declare class EntityList<T> {
    protected items: T[];
    add(item: T): void;
    getAll(): T[];
    clear(): void;
}
