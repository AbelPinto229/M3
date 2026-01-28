import { BaseEntity } from './BaseEntity.js';
import { UserRole } from '../security/UserRole.js';
/**
 * Classe que representa um usuário do sistema
 * Herda de BaseEntity para id e createdAt
 * Encapsula propriedades com getters/setters
 */
export declare class UserClass extends BaseEntity {
    private _email;
    private _active;
    private _role;
    constructor(id: number, email: string, role: UserRole);
    get email(): string;
    set email(value: string);
    get active(): boolean;
    get role(): UserRole;
    set role(value: UserRole);
    /**
     * Ativa ou desativa o usuário
     */
    toggleActive(): void;
    /**
     * Validação simples de email
     */
    private validateEmail;
}
