export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    active: boolean;
    photo?: string;
}
