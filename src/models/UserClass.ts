import { BaseEntity } from './BaseEntity';
import { UserRole } from '../security/UserRole';

export class UserClass extends BaseEntity {
    private _email: string;
    private _active: boolean;
    private _role: UserRole;

    constructor(id: number, email: string, role: UserRole) {
        super(id);
        this.email = email;   // usa setter para validar
        this._role = role;
        this._active = true;  // padrão ativo
    }

    // GETTERS
    get email(): string {
        return this._email;
    }

    get active(): boolean {
        return this._active;
    }

    get role(): UserRole {
        return this._role;
    }

    // SETTERS
    set email(value: string) {
        if (!this.validateEmail(value)) {
            throw new Error('Email inválido');
        }
        this._email = value;
    }

    set active(value: boolean) {
        this._active = value;
    }

    set role(value: UserRole) {
        if (!value) {
            throw new Error('Role inválido');
        }
        this._role = value;
    }

    // Método privado de validação de email
    private validateEmail(email: string): boolean {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    // Método de conveniência para alternar ativo/inativo
    toggleActive(): void {
        this._active = !this._active;
    }
}
