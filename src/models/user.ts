// ---------------------------
// INTERFACE E CLASSE
// ---------------------------
export interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    photo?: string;
}

export class UserClass implements User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    photo?: string;

    constructor(id: number, name: string, email: string, photo?: string, active: boolean = true) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.photo = photo;
        this.active = active;
    }

    toggleActive(): void {
        this.active = !this.active;
    }
}

