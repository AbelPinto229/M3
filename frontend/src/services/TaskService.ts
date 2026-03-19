import { Task } from '../models/Task.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { BugTask } from '../tasks/BugTask.js';

// TASK SERVICE - Manages task creation, updates, and lifecycle with backend API integration
// Extended task interface with additional properties (priority, deadline, assignments)
export interface ExtendedTask extends Task {
  priority?: string;
  deadline?: string;
  assigned?: string[];
}

export class TaskService {
  private API_BASE_URL = 'http://localhost:3000';
  private tasks: ExtendedTask[] = [];

  // Carrega todas as tasks da API
  async loadTasks(): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks`);
      if (response.ok) {
        this.tasks = await response.json();
        console.log(`✅ ${this.tasks.length} tarefas carregadas da API`);
      }
    } catch (error) {
      console.error('⚠️ Erro ao carregar tasks da API:', error);
      // Fallback: usar algumas tasks de exemplo
      this.tasks = [
        { id: 1, title: 'Tarefa de Exemplo 1', type: 'task', status: 'Criado', priority: 'MEDIUM' },
        { id: 2, title: 'Tarefa de Exemplo 2', type: 'task', status: 'Em Progresso', priority: 'HIGH' },
      ];
      console.log('📦 Modo offline: A usar tarefas de exemplo');
    }
  }

  // Returns all tasks
  getTasks(): ExtendedTask[] {
    return this.tasks;
  }

  // Retrieves a specific task by ID
  getTaskById(id: number): ExtendedTask | undefined {
    return this.tasks.find(t => t.id === id);
  }

  // Retrieves all tasks with a specific status
  getTasksByStatus(status: string): ExtendedTask[] {
    return this.tasks.filter(t => t.status === status);
  }

  // Creates a new task
  async addTask(title: string, type: string, deadline?: string): Promise<ExtendedTask> {
    console.log('📝 Frontend: Criando tarefa', { title, type, deadline });
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, status: 'CREATED', deadline })
      });
      
      console.log('📡 Resposta da API:', response.status, response.ok);
      
      if (response.ok) {
        const newTask = await response.json();
        this.tasks.push(newTask);
        console.log('✅ Tarefa criada na API:', newTask);
        console.log('📋 Total de tarefas agora:', this.tasks.length);
        return newTask;
      }
      
      console.error('❌ API retornou erro:', response.status);
      // Fallback - criar localmente se a API falhar
      const task: ExtendedTask = {
        id: Date.now(),
        title,
        type,
        status: TaskStatus.CREATED,
        deadline
      };
      this.tasks.push(task);
      console.log('📦 Modo offline: Tarefa criada localmente:', task);
      return task;
    } catch (error) {
      console.error('⚠️ Erro ao criar task na API. A criar localmente...', error);
      const task: ExtendedTask = {
        id: Date.now(),
        title,
        type,
        status: TaskStatus.CREATED,
        deadline
      };
      this.tasks.push(task);
      return task;
    }
  }

  // updates task status
  async updateTaskStatus(id: number, status: string): Promise<void> {
    try {
      const task = this.getTaskById(id);
      if (!task) return;
      
      const response = await fetch(`${this.API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        task.status = status;
        console.log(`✅ Status da tarefa ${id} atualizado para ${status}`);
      } else {
        console.error('❌ Erro ao atualizar status:', response.status);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }

  // updates task title
  async updateTaskTitle(id: number, title: string): Promise<void> {
    try {
      const task = this.getTaskById(id);
      if (!task) return;
      
      const response = await fetch(`${this.API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if (response.ok) {
        task.title = title;
        console.log(`✅ Título da tarefa ${id} atualizado`);
      } else {
        console.error('❌ Erro ao atualizar título:', response.status);
      }
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
    }
  }

  // updates task priority level
  async updateTaskPriority(id: number, priority: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });
      
      if (response.ok) {
        const task = this.getTaskById(id);
        if (task) task.priority = priority;
        console.log(`✅ Prioridade da tarefa ${id} atualizada para ${priority}`);
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('❌ Erro ao atualizar prioridade:', response.status, err);
      }
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error);
    }
  }

  async updateTaskHighlight(id: number, highlight: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlight })
      });
      if (response.ok) {
        const task = this.getTaskById(id);
        if (task) (task as any).highlight = highlight;
        console.log(`✅ Destaque da tarefa ${id} atualizado para ${highlight}`);
      } else {
        console.error('❌ Erro ao atualizar destaque:', response.status);
      }
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error);
    }
  }

  // updates task deadline date
  async updateTaskDeadline(id: number, deadline: string): Promise<void> {
    try {
      const task = this.getTaskById(id);
      if (!task) return;
      
      const response = await fetch(`${this.API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deadline })
      });
      
      if (response.ok) {
        task.deadline = deadline;
        console.log(`✅ Deadline da tarefa ${id} atualizado`);
      } else {
        console.error('❌ Erro ao atualizar deadline:', response.status);
      }
    } catch (error) {
      console.error('Erro ao atualizar deadline:', error);
    }
  }

  // assigns a user to a task by email
  async assignUser(taskId: number, email: string): Promise<void> {
    try {
      const task = this.getTaskById(taskId);
      if (!task) return;
      
      if (!task.assigned) task.assigned = [];
      if (!task.assigned.includes(email)) {
        task.assigned.push(email);
        
        const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...task, assigned: task.assigned })
        });
        
        if (!response.ok) {
          // Rollback se falhar
          task.assigned = task.assigned.filter(e => e !== email);
        }
      }
    } catch (error) {
      console.error('Erro ao atribuir user:', error);
    }
  }

  //removes a user assignment from a task
  async unassignUser(taskId: number, email: string): Promise<void> {
    try {
      const task = this.getTaskById(taskId);
      if (!task || !task.assigned) return;
      
      task.assigned = task.assigned.filter(e => e !== email);
      
      const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, assigned: task.assigned })
      });
    } catch (error) {
      console.error('Erro ao remover atribuição:', error);
    }
  }

  //deletes a task by ID
  async deleteTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        console.log('✅ Tarefa deletada na API');
      }
    } catch (error) {
      console.error('⚠️ Erro ao deletar task na API. A deletar localmente...', error);
      // Fallback: deletar localmente
      this.tasks = this.tasks.filter(t => t.id !== id);
      console.log('📦 Modo offline: Tarefa deletada localmente');
    }
  }
}
