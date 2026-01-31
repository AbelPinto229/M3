/**
 * Generic Dependency Graph
 * Models dependencies between entities (Tasks, Users, etc)
 */
export class DependencyGraph {
    graph = new Map();
    // Adiciona uma relação de dependência: item depende de dependsOn
    addDependency(item, dependsOn) {
        if (!this.graph.has(item)) {
            this.graph.set(item, []);
        }
        const deps = this.graph.get(item);
        if (!deps.includes(dependsOn)) {
            deps.push(dependsOn);
        }
    }
    // Obtém todos os itens dos quais o item depende
    getDependencies(item) {
        return this.graph.get(item) || [];
    }
    // Verifica se o item tem dependências
    hasDependencies(item) {
        const deps = this.graph.get(item);
        return deps !== undefined && deps.length > 0;
    }
    // Remove uma relação de dependência
    removeDependency(item, dependsOn) {
        const deps = this.graph.get(item);
        if (deps) {
            const index = deps.indexOf(dependsOn);
            if (index !== -1) {
                deps.splice(index, 1);
            }
        }
    }
}
//# sourceMappingURL=DependencyGraph.js.map