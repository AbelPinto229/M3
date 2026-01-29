import { BaseEntity } from './BaseEntity.js';
import { UserRole } from '../security/UserRole.js';

// USER CLASS - Represents a user in the system
export class UserClass extends BaseEntity {
    private _email!: string;       
    private _active!: boolean;     
    private _role!: UserRole;      

    constructor(id: number, email: string, role: UserRole) {
        super(id);                 
        this.email = email;        
        this._role = role;         
        this._active = true;       
    }

    // ===========================
    // GETTERS AND SETTERS
    // ===========================

    //read email as public and return the private _email
    get email(): string {
        return this._email;
    }

    //if email is invalid throw error
    set email(value: string) {
        if (!this.validateEmail(value)) {
            throw new Error(`Invalid email: ${value}`);
        }
        this._email = value;
    }
    //read user status and show atual status, if its true show active, if its false show inactive
    get active(): boolean {
        return this._active;
    }
    //read user role and show the role assigned
    get role(): UserRole {
        return this._role;
    }
    //if role is invalid or undefined throw error
    set role(value: UserRole) {
        if (value === undefined || value === null) {
            throw new Error('Invalid role');
        }
        this._role = value;
    }


    //Activates or deactivates the user
    
    toggleActive(): void {
        this._active = !this._active;
    }

    
     //Simple email validation, to guaranteed something is written after @ and .

    private validateEmail(email: string): boolean {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
