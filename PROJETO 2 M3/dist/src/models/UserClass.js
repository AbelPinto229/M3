import { BaseEntity } from './BaseEntity.js';
// USER CLASS - Represents a user in the system
export class UserClass extends BaseEntity {
    _email;
    _active;
    _role;
    constructor(id, email, role) {
        super(id);
        this.email = email;
        this._role = role;
        this._active = true;
    }
    // ===========================
    // GETTERS AND SETTERS
    // ===========================
    //read email as public and return the private _email
    get email() {
        return this._email;
    }
    //if email is invalid throw error
    set email(value) {
        if (!this.validateEmail(value)) {
            throw new Error(`Invalid email: ${value}`);
        }
        this._email = value;
    }
    //read user status and show atual status, if its true show active, if its false show inactive
    get active() {
        return this._active;
    }
    //read user role and show the role assigned
    get role() {
        return this._role;
    }
    //if role is invalid or undefined throw error
    set role(value) {
        if (value === undefined || value === null) {
            throw new Error('Invalid role');
        }
        this._role = value;
    }
    //Activates or deactivates the user
    toggleActive() {
        this._active = !this._active;
    }
    //Simple email validation, to guaranteed something is written after @ and .
    validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
//# sourceMappingURL=UserClass.js.map