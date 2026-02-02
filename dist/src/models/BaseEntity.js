// BASE ENTITY - Base class for all entities
export class BaseEntity {
    id;
    createdAt;
    // Contador global de entidades
    static totalEntities = 0;
    constructor(id) {
        this.id = id; // Entity ID
        this.createdAt = new Date(); // Creation timestamp
        // Incrementar contador global
        BaseEntity.totalEntities++;
    }
    // show id of entities but in this case is herded by UserClass
    getId() {
        return this.id;
    }
    // show the date of the creation of the entity
    getCreatedAt() {
        return this.createdAt;
    }
    // Obter total global de entidades criadas
    static getTotalEntities() {
        return BaseEntity.totalEntities;
    }
    // Reset para testes
    static resetCounter() {
        BaseEntity.totalEntities = 0;
    }
}
//# sourceMappingURL=BaseEntity.js.map