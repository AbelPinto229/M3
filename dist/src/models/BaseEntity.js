export class BaseEntity {
    id;
    createdAt;
    constructor(id) {
        this.id = id; // inicializa o id
        this.createdAt = new Date(); // data/hora de criação
    }
    // Retorna o id da entidade
    getId() {
        return this.id;
    }
    // Retorna a data de criação da entidade
    getCreatedAt() {
        return this.createdAt;
    }
}
//# sourceMappingURL=BaseEntity.js.map