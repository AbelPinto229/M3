export declare class BaseEntity {
    protected id: number;
    protected createdAt: Date;
    constructor(id: number);
    getId(): number;
    getCreatedAt(): Date;
}
