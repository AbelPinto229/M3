import { BaseEntity } from './BaseEntity.js';
import { UserRole } from '../security/UserRole.js';

/**
 * Class representing a system user
 * Inherits from BaseEntity for id and createdAt
 * Encapsulates properties with getters/setters
 */
export class UserClass extends BaseEntity {
    private _email!: string;       // user email
    private _active!: boolean;     // active or inactive
    private _role!: UserRole;      // user role

    constructor(id: number, email: string, role: UserRole) {
        super(id);                 // initializes id and createdAt from BaseEntity
        this.email = email;        // uses setter for validation
        this._role = role;         // initial role
        this._active = true;       // user starts active
    }

    // ===========================
    // GETTERS AND SETTERS
    // ===========================

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (!this.validateEmail(value)) {
            throw new Error(`Invalid email: ${value}`);
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
            throw new Error('Invalid role');
        }
        this._role = value;
    }

    // ===========================
    // BUSINESS METHODS
    // ===========================

    /**
     * Activates or deactivates the user
     */
    toggleActive(): void {
        this._active = !this._active;
    }

    /**
     * Simple email validation
     */
    private validateEmail(email: string): boolean {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
