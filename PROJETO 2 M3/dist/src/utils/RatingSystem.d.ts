export declare class RatingSystem<T> {
    private ratings;
    rate(item: T, value: number): void;
    getAverage(item: T): number;
    getRatings(item: T): number[];
    clearRatings(item: T): void;
    getRatingCount(item: T): number;
}
