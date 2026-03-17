/**
 * Generic Dependency Graph
 * Models dependencies between entities (Tasks, Users, etc)
 */
export declare class DependencyGraph<T> {
    private graph;
    addDependency(item: T, dependsOn: T): void;
    getDependencies(item: T): T[];
    hasDependencies(item: T): boolean;
    removeDependency(item: T, dependsOn: T): void;
}
