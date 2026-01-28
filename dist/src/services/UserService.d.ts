import { User } from '../models/Users.js';
import { UserRole } from '../security/UserRole.js';
export declare class UserService {
    private users;
    private nextId;
    getUsers(): User[];
    getUserById(id: number): User | undefined;
    getUserByEmail(email: string): User | undefined;
    getActiveUsers(): User[];
    addUser(email: string, name: string, role: string | UserRole, photo?: string): User | null;
    toggleUserStatus(id: number): void;
    deleteUser(id: number): void;
}
