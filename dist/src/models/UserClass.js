import { BaseEntity } from './BaseEntity.js';
/**
 * Classe que representa um usuário do sistema
 * Herda de BaseEntity para id e createdAt
 * Encapsula propriedades com getters/setters
 */
export class UserClass extends BaseEntity {
    _email; // email do usuário
    _active; // ativo ou inativo
    _role; // perfil do usuário
    constructor(id, email, role) {
        super(id); // inicializa id e createdAt da BaseEntity
        this.email = email; // usa setter para validação
        this._role = role; // role inicial
        this._active = true; // usuário começa ativo
    }
    // ===========================
    // GETTERS E SETTERS
    // ===========================
    get email() {
        return this._email;
    }
    set email(value) {
        if (!this.validateEmail(value)) {
            throw new Error(`Email inválido: ${value}`);
        }
        this._email = value;
    }
    get active() {
        return this._active;
    }
    get role() {
        return this._role;
    }
    set role(value) {
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
    toggleActive() {
        this._active = !this._active;
    }
    /**
     * Validação simples de email
     */
    validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
//# sourceMappingURL=UserClass.js.map