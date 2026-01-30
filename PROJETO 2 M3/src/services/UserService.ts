import { User } from '../models/Users.js';
import { UserRole } from '../security/UserRole.js';

// USER SERVICE - Manages user accounts, roles, and permissions
export class UserService {
  // Array storing all system users
  private users: User[] = [
    { id: 0, email: 'admin@sistema.com', name: 'Administrator', role: 'ADMIN', active: true },
    { id: 1, name: 'Abel Pinto', email: 'abel@example.com', role: 'MEMBER', active: true },
    { id: 2, name: 'Joel Pinto', email: 'joel@example.com', role: 'MANAGER', active: false },
    { id: 3, name: 'Lionel Pinto', email: 'Lionel@example.com', role: 'MEMBER', active: true },
    { id: 4, name: 'Isabel Pinto', email: 'Isabel@example.com', role: 'VIEWER', active: false },
    { id: 5, name: 'Ezequiel Pinto', email: 'Ezequiel@example.com', role: 'MEMBER', active: true }
  ];
  // Counter for generating unique user IDs
  private nextId = 6;

  // Returns all users
  getUsers(): User[] {
    return this.users;
  }

  // Retrieves a specific user by ID
  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  // Retrieves a specific user by email address
  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  // Retrieves all active users
  getActiveUsers(): User[] {
    return this.users.filter(u => u.active);
  }

  // Creates a new user (returns null if email already exists)
  addUser(email: string, name: string, role: string | UserRole, photo?: string): User | null {
    if (this.users.some(u => u.email === email)) return null;
    
    const user: User = { id: this.nextId++, email, name, role: role as any, active: true, photo };
    this.users.push(user);
    return user;
  }

  // Toggles user active/inactive status
  toggleUserStatus(id: number): void {
    const user = this.getUserById(id);
    if (user) user.active = !user.active;
  }

  // Deletes a user by ID
  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }

  // Updates user information with duplicate email prevention
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
