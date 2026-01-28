import { User } from '../models/Users.js';
import { UserRole } from '../security/UserRole.js';

export class UserService {
  private users: User[] = [{ id: 0, email: 'admin@sistema.com', name: 'Administrator', role: 'ADMIN', active: true }];
  private nextId = 1;

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getActiveUsers(): User[] {
    return this.users.filter(u => u.active);
  }

  addUser(email: string, name: string, role: string | UserRole, photo?: string): User | null {
    if (this.users.some(u => u.email === email)) return null;
    
    const user: User = { id: this.nextId++, email, name, role: role as any, active: true, photo };
    this.users.push(user);
    return user;
  }

  toggleUserStatus(id: number): void {
    const user = this.getUserById(id);
    if (user) user.active = !user.active;
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }
}
