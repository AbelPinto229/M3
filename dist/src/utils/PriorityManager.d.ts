export declare class PriorityManager<T> {
    private priorities;
    setPriority(item: T, value: number): void;
    getPriority(item: T): number | undefined;
    getAll(): Map<T, number>;
}
