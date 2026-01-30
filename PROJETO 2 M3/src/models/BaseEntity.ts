// BASE ENTITY - Base class for all entities
export class BaseEntity {
    protected id: number;
    protected createdAt: Date;

    constructor(id: number) {
        this.id = id;             // Entity ID
        this.createdAt = new Date(); // Creation timestamp
    }

    // show id of entities but in this case is herded by UserClass
    getId(): number {
        return this.id;
    }

    // show the date of the creation of the entity
    getCreatedAt(): Date {
        return this.createdAt;
    }
}
