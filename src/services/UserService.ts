import { User } from '../models/Users.js';
import { UserRole } from '../security/UserRole.js';

export class UserService {
  private users: User[] = [
    { id: 0, email: 'admin@sistema.com', name: 'Administrator', role: 'ADMIN', active: true },
    { id: 1, name: 'Abel Pinto', email: 'abel@example.com', role: 'MEMBER', active: true },
    { id: 2, name: 'Joel Pinto', email: 'joel@example.com', role: 'MANAGER', active: false },
    { id: 3, name: 'Lionel Pinto', email: 'Lionel@example.com', role: 'MEMBER', active: true },
    { id: 4, name: 'Isabel Pinto', email: 'Isabel@example.com', role: 'VIEWER', active: false },
    { id: 5, name: 'Ezequiel Pinto', email: 'Ezequiel@example.com', role: 'MEMBER', active: true }
  ];
  private nextId = 6;

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

  updateUser(id: number, updates: Partial<User>): User | null {
    const user = this.getUserById(id);
    if (!user) return null;
    
    // Don't allow email duplicates on update
    if (updates.email && updates.email !== user.email && this.users.some(u => u.email === updates.email)) {
      return null;
    }
    
    Object.assign(user, updates);
    return user;
  }
}
