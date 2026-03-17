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
    { id: 5, name: 'Ezequiel Pinto', email: 'Ezequiel@example.com', role: 'MEMBER', active: true },
    { id: 6, name: 'Ana Silva', email: 'ana.silva@example.com', role: 'MEMBER', active: true },
    { id: 7, name: 'Bruno Costa', email: 'bruno.costa@example.com', role: 'MANAGER', active: true },
    { id: 8, name: 'Carla Martins', email: 'carla.martins@example.com', role: 'MEMBER', active: false },
    { id: 9, name: 'David Santos', email: 'david.santos@example.com', role: 'MEMBER', active: true },
    { id: 10, name: 'Elisa Ferreira', email: 'elisa.ferreira@example.com', role: 'VIEWER', active: true },
    { id: 11, name: 'Francisco Oliveira', email: 'francisco.oliveira@example.com', role: 'MEMBER', active: true },
    { id: 12, name: 'Graça Sousa', email: 'graca.sousa@example.com', role: 'MANAGER', active: false },
    { id: 13, name: 'Hugo Pereira', email: 'hugo.pereira@example.com', role: 'MEMBER', active: true },
    { id: 14, name: 'Iris Gomes', email: 'iris.gomes@example.com', role: 'MEMBER', active: true },
    { id: 15, name: 'Jorge Ribeiro', email: 'jorge.ribeiro@example.com', role: 'VIEWER', active: false },
    { id: 16, name: 'Karen Lopes', email: 'karen.lopes@example.com', role: 'MEMBER', active: true },
    { id: 17, name: 'Lúcio Tavares', email: 'lucio.tavares@example.com', role: 'MEMBER', active: true },
    { id: 18, name: 'Marta Alves', email: 'marta.alves@example.com', role: 'MANAGER', active: true },
    { id: 19, name: 'Nuno Dias', email: 'nuno.dias@example.com', role: 'MEMBER', active: false },
    { id: 20, name: 'Olga Rocha', email: 'olga.rocha@example.com', role: 'MEMBER', active: true },
    { id: 21, name: 'Paulo Mendes', email: 'paulo.mendes@example.com', role: 'VIEWER', active: true },
    { id: 22, name: 'Querida Cruz', email: 'querida.cruz@example.com', role: 'MEMBER', active: true },
    { id: 23, name: 'Rita Neves', email: 'rita.neves@example.com', role: 'MEMBER', active: false },
    { id: 24, name: 'Sergio Cabral', email: 'sergio.cabral@example.com', role: 'MANAGER', active: true },
    { id: 25, name: 'Tânia Monteiro', email: 'tania.monteiro@example.com', role: 'MEMBER', active: true },
    { id: 26, name: 'Ulisses Brás', email: 'ulisses.bras@example.com', role: 'MEMBER', active: true },
    { id: 27, name: 'Vanessa Leite', email: 'vanessa.leite@example.com', role: 'VIEWER', active: false },
    { id: 28, name: 'Wagner Nascimento', email: 'wagner.nascimento@example.com', role: 'MEMBER', active: true },
    { id: 29, name: 'Ximena Cardoso', email: 'ximena.cardoso@example.com', role: 'MEMBER', active: true },
    { id: 30, name: 'Yara Barbosa', email: 'yara.barbosa@example.com', role: 'MANAGER', active: false },
    { id: 31, name: 'Zila Moreira', email: 'zila.moreira@example.com', role: 'MEMBER', active: true },
    { id: 32, name: 'André Neves', email: 'andre.neves@example.com', role: 'MEMBER', active: true },
    { id: 33, name: 'Beatriz Teixeira', email: 'beatriz.teixeira@example.com', role: 'VIEWER', active: true },
    { id: 34, name: 'Cristóvão Duarte', email: 'cristovao.duarte@example.com', role: 'MEMBER', active: false },
    { id: 35, name: 'Deolinda Leal', email: 'deolinda.leal@example.com', role: 'MANAGER', active: true }
  ];
  // Counter for generating unique user IDs
  private nextId = 36;

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
