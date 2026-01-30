export declare class Favorites<T> {
    private items;
    add(item: T): void;
    remove(item: T): void;
    exists(item: T): boolean;
    getAll(): T[];
}
