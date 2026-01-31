/**
 * Generic Dependency Graph
 * Models dependencies between entities (Tasks, Users, etc)
 */
export class DependencyGraph<T> {
  private graph: Map<T, T[]> = new Map();

  // Adiciona uma relação de dependência: item depende de dependsOn
  addDependency(item: T, dependsOn: T): void {
    if (!this.graph.has(item)) {
      this.graph.set(item, []);
    }
    
    const deps = this.graph.get(item)!;
    if (!deps.includes(dependsOn)) {
      deps.push(dependsOn);
    }
  }

  // Obtém todos os itens dos quais o item depende
  getDependencies(item: T): T[] {
    return this.graph.get(item) || [];
  }

  // Verifica se o item tem dependências
  hasDependencies(item: T): boolean {
    const deps = this.graph.get(item);
    return deps !== undefined && deps.length > 0;
  }

  // Remove uma relação de dependência
  removeDependency(item: T, dependsOn: T): void {
    const deps = this.graph.get(item);
    if (deps) {
      const index = deps.indexOf(dependsOn);
      if (index !== -1) {
        deps.splice(index, 1);
      }
    }
  }
}
