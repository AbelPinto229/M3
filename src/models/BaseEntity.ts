// BASE ENTITY - Base class for all entities
export class BaseEntity {
    protected id: number;
    protected createdAt: Date;
    
    // Contador global de entidades
    private static totalEntities: number = 0;

    constructor(id: number) {
        this.id = id;             // Entity ID
        this.createdAt = new Date(); // Creation timestamp
        
        // Incrementar contador global
        BaseEntity.totalEntities++;
    }

    // show id of entities but in this case is herded by UserClass
    getId(): number {
        return this.id;
    }

    // show the date of the creation of the entity
    getCreatedAt(): Date {
        return this.createdAt;
    }
    
    // Obter total global de entidades criadas
    static getTotalEntities(): number {
        return BaseEntity.totalEntities;
    }
    
    // Reset para testes
    static resetCounter(): void {
        BaseEntity.totalEntities = 0;
    }
}
