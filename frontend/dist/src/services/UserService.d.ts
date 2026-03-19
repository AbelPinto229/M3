import { User } from '../models/Users.js';
import { UserRole } from '../security/UserRole.js';
export declare class UserService {
    private API_BASE_URL;
    private users;
    loadUsers(): Promise<void>;
    getUsers(): User[];
    getUserById(id: number): User | undefined;
    getUserByEmail(email: string): User | undefined;
    getActiveUsers(): User[];
    addUser(email: string, name: string, role: string | UserRole, photo?: string): Promise<User | null>;
    toggleUserStatus(id: number): Promise<void>;
    deleteUser(id: number): Promise<void>;
    updateUser(id: number, updates: Partial<User>): Promise<User | null>;
}
