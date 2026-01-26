export declare enum Priority {
    High = "HIGH",
    Critical = "CRITICAL"
}
export declare function setPriority(taskID: number, prio: Priority): void;
export declare function getPriority(taskID: number): Priority | undefined;
export declare function getHighPriorityTasks(): number[];
