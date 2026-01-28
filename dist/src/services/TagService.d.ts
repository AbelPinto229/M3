export declare class TagService {
    private tags;
    addTag(taskId: number, tag: string): void;
    removeTag(taskId: number, tag: string): void;
    getTags(taskId: number): string[];
    getTasksByTag(tag: string): number[];
}
