export class PriorityManager<T> {
    private priorities: Map<T, number> = new Map();

    //define a prioridade de uma entidade

    setPriority(item: T, value: number): void {
        this.priorities.set(item, value);
    }

    //obtém a prioridade de uma entidade
    
    getPriority(item: T): number | undefined {
        return this.priorities.get(item);
    }

    //obtém todas as prioridades
     
    getAll(): Map<T, number> {
        return new Map(this.priorities);
    }
}
