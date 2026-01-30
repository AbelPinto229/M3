export declare class WatcherSystem<T, U> {
    private watchers;
    watch(target: T, user: U): void;
    unwatch(target: T, user: U): void;
    getWatchers(target: T): U[];
}
