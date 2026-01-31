export declare class BaseEntity {
    protected id: number;
    protected createdAt: Date;
    private static totalEntities;
    constructor(id: number);
    getId(): number;
    getCreatedAt(): Date;
    static getTotalEntities(): number;
    static resetCounter(): void;
}
