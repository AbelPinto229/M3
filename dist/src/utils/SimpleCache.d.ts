export declare class SimpleCache<K, T> {
    private cache;
    constructor();
    set(key: K, value: T): void;
    get(key: K): T | undefined;
}
