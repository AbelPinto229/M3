"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
class BaseEntity {
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
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=BaseEntity.js.map