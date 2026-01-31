export declare class BusinessRules {
    static canUserBeDeactivated(activeTasks: number): boolean;
    static canTaskBeCompleted(isBlocked: boolean): boolean;
    static canAssignTask(active: boolean): boolean;
    static isValidTitle(title: string): boolean;
    static isValidPriority(priority: string): boolean;
    static isValidRole(role: string): boolean;
}
