export class PriorityManager {
    priorities = new Map();
    //define a prioridade de uma entidade
    setPriority(item, value) {
        this.priorities.set(item, value);
    }
    //obtém a prioridade de uma entidade
    getPriority(item) {
        return this.priorities.get(item);
    }
    //obtém todas as prioridades
    getAll() {
        return new Map(this.priorities);
    }
}
//# sourceMappingURL=PriorityManager.js.map