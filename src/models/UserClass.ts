import { BaseEntity } from './BaseEntity';
import { UserRole } from '../security/UserRole';

/**
 * Classe que representa um usuário do sistema
 * Herda de BaseEntity para id e createdAt
 * Encapsula propriedades com getters/setters
 */
export class UserClass extends BaseEntity {
    private _email!: string;       // email do usuário
    private _active!: boolean;     // ativo ou inativo
    private _role!: UserRole;      // perfil do usuário

    constructor(id: number, email: string, role: UserRole) {
        super(id);                 // inicializa id e createdAt da BaseEntity
        this.email = email;        // usa setter para validação
        this._role = role;         // role inicial
        this._active = true;       // usuário começa ativo
    }

    // ===========================
    // GETTERS E SETTERS
    // ===========================

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (!this.validateEmail(value)) {
            throw new Error(`Email inválido: ${value}`);
        }
        this._email = value;
    }

    get active(): boolean {
        return this._active;
    }

    get role(): UserRole {
        return this._role;
    }

    set role(value: UserRole) {
        if (value === undefined || value === null) {
            throw new Error('Role inválido');
        }
        this._role = value;
    }

    // ===========================
    // MÉTODOS DE NEGÓCIO
    // ===========================

    /**
     * Ativa ou desativa o usuário
     */
    toggleActive(): void {
        this._active = !this._active;
    }

    /**
     * Validação simples de email
     */
    private validateEmail(email: string): boolean {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
