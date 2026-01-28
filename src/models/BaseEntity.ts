export class BaseEntity {
    protected id: number;
    protected createdAt: Date;

    constructor(id: number) {
        this.id = id;             // inicializa o id
        this.createdAt = new Date(); // data/hora de criação
    }

    // Retorna o id da entidade
    getId(): number {
        return this.id;
    }

    // Retorna a data de criação da entidade
    getCreatedAt(): Date {
        return this.createdAt;
    }
}
