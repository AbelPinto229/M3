import { BaseEntity } from './BaseEntity.js';
import { UserRole } from '../security/UserRole.js';
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
    toggleActive(): void;
    private validateEmail;
}
