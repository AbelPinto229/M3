export declare class DeadlineService {
    private deadlines;
    setDeadline(taskId: number, date: Date): void;
    isExpired(taskId: number): boolean;
    getExpiredTasks(): number[];
}
