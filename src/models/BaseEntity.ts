// BASE ENTITY - Base class for all entities

export class BaseEntity {
    protected id: number;
    protected createdAt: Date;

    constructor(id: number) {
        this.id = id;             // Entity ID
        this.createdAt = new Date(); // Creation timestamp
    }

    // Get entity ID
    getId(): number {
        return this.id;
    }

    // Get creation date
    getCreatedAt(): Date {
        return this.createdAt;
    }
}
