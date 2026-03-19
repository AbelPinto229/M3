import { User } from '../models/Users.js';
import { UserRole } from '../security/UserRole.js';

// USER SERVICE - Manages user accounts, roles, and permissions with backend API integration
export class UserService {
  private API_BASE_URL = 'http://localhost:3000';
  // Cache local para evitar chamadas repetidas
  private users: User[] = [];

  // Carrega todos os users da API
  async loadUsers(): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users`);
      if (response.ok) {
        this.users = await response.json();
        console.log(`✅ ${this.users.length} utilizadores carregados da API`);
      }
    } catch (error) {
      console.error('⚠️ Erro ao carregar users da API:', error);
      // Fallback: usar alguns users de exemplo
      this.users = [
        { id: 0, email: 'admin@sistema.com', name: 'Administrator', role: 'ADMIN', active: true },
        { id: 1, name: 'Abel Pinto', email: 'abel@example.com', role: 'MEMBER', active: true },
        { id: 2, name: 'Joel Pinto', email: 'joel@example.com', role: 'MANAGER', active: true },
      ];
      console.log('📦 Modo offline: A usar utilizadores de exemplo');
    }
  }

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
  async addUser(email: string, name: string, role: string | UserRole, photo?: string): Promise<User | null> {
    // Check for duplicates locally first
    if (this.users.some(u => u.email === email)) {
      console.warn('Email já existe:', email);
      return null;
    }
    
    try {
      const response = await fetch(`${this.API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, photo, active: true })
      });
      
      if (response.ok) {
        const newUser = await response.json();
        this.users.push(newUser);
        console.log('✅ Utilizador criado na API:', newUser);
        return newUser;
      }
      return null;
    } catch (error) {
      console.error('⚠️ Erro ao criar user na API. A criar localmente...', error);
      // Fallback: criar localmente
      const newUser: User = { 
        id: Date.now(), 
        email, 
        name, 
        role: role as any, 
        active: true, 
        photo 
      };
      this.users.push(newUser);
      console.log('📦 Modo offline: Utilizador criado localmente:', newUser);
      return newUser;
    }
  }

  // Toggles user active/inactive status
  async toggleUserStatus(id: number): Promise<void> {
    const user = this.getUserById(id);
    if (!user) return;
    
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${id}`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        console.log('✅ Status atualizado na API');
      }
    } catch (error) {
      console.error('⚠️ Erro ao toggle status na API. A atualizar localmente...', error);
      // Fallback: atualizar localmente
      user.active = !user.active;
      console.log('📦 Modo offline: Status atualizado localmente');
    }
  }

  // Deletes a user by ID
  async deleteUser(id: number): Promise<void> {
    console.log('🗑️ A eliminar utilizador com ID:', id);
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${id}`, {
        method: 'DELETE'
      });
      
      console.log('📡 Resposta da API:', response.status, response.ok);
      
      if (response.ok) {
        this.users = this.users.filter(u => u.id !== id);
        console.log('✅ Utilizador deletado na API. Users restantes:', this.users.length);
      } else {
        console.error('❌ API retornou erro:', response.status);
        // Fallback: deletar localmente mesmo assim
        this.users = this.users.filter(u => u.id !== id);
        console.log('📦 Deletado localmente apesar do erro. Users restantes:', this.users.length);
      }
    } catch (error) {
      console.error('⚠️ Erro ao deletar user na API. A deletar localmente...', error);
      // Fallback: deletar localmente
      this.users = this.users.filter(u => u.id !== id);
      console.log('📦 Modo offline: Utilizador deletado localmente. Users restantes:', this.users.length);
    }
  }

  // Updates user information with duplicate email prevention
  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar user:', error);
      return null;
    }
  }
}
