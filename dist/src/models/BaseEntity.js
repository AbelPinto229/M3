// BASE ENTITY - Base class for all entities
export class BaseEntity {
    id;
    createdAt;
    constructor(id) {
        this.id = id; // Entity ID
        this.createdAt = new Date(); // Creation timestamp
    }
    // show id of entities but in this case is herded by UserClass
    getId() {
        return this.id;
    }
    // show the date of the creation of the entity
    getCreatedAt() {
        return this.createdAt;
    }
}
//# sourceMappingURL=BaseEntity.js.map