import { Task } from '../models/Task.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { BugTask } from '../tasks/BugTask.js';

// TASK SERVICE - Manages task creation, updates, and lifecycle
// Extended task interface with additional properties (priority, deadline, assignments)
export interface ExtendedTask extends Task {
  priority?: string;
  deadline?: string;
  assigned?: string[];
}

export class TaskService {
  private tasks: ExtendedTask[] = [
    { id: 1, title: 'Revisar diapositivos da aula 2', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-05', assigned: ['0'] },
    { id: 2, title: 'Fazer exercícios orientados', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-03', assigned: ['1', '3'] },
    { id: 3, title: 'Fazer exercícios autónomos', type: 'task', status: 'Criado', priority: 'LOW', deadline: '2026-02-10', assigned: [] },
    { id: 4, title: 'Implementar autenticação de utilizadores', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-08', assigned: ['7', '18', '24'] },
    { id: 5, title: 'Documentar API REST', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-15', assigned: ['11'] },
    { id: 6, title: 'Testes unitários do módulo de pagamento', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-06', assigned: ['9', '13'] },
    { id: 7, title: 'Corrigir bug no relatório de vendas', type: 'bug', status: 'Atribuído', priority: 'CRITICAL', deadline: '2026-02-01', assigned: ['16'] },
    { id: 8, title: 'Otimizar queries do banco de dados', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-20', assigned: [] },
    { id: 9, title: 'Implementar notificações por email', type: 'task', status: 'Em Progresso', priority: 'MEDIUM', deadline: '2026-02-12', assigned: ['6', '25'] },
    { id: 10, title: 'Revisar código de segurança', type: 'task', status: 'Criado', priority: 'HIGH', deadline: '2026-02-09', assigned: ['0'] },
    { id: 11, title: 'Criar interface de utilizador para dashboard', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-14', assigned: ['1', '14', '20'] },
    { id: 12, title: 'Migrar base de dados para PostgreSQL', type: 'task', status: 'Criado', priority: 'CRITICAL', deadline: '2026-02-25', assigned: [] },
    { id: 13, title: 'Implementar cache com Redis', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-18', assigned: ['22'] },
    { id: 14, title: 'Corrigir erro de formatação de datas', type: 'bug', status: 'Concluído', priority: 'LOW', deadline: '2026-01-28', assigned: ['29'] },
    { id: 15, title: 'Desenvolver módulo de relatórios', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-22', assigned: ['26', '30'] },
    { id: 16, title: 'Integração com API do Slack', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-28', assigned: [] },
    { id: 17, title: 'Ajustar layout responsivo para mobile', type: 'task', status: 'Em Progresso', priority: 'MEDIUM', deadline: '2026-02-11', assigned: ['8', '17'] },
    { id: 18, title: 'Resolver problema de memória na aplicação', type: 'bug', status: 'Atribuído', priority: 'CRITICAL', deadline: '2026-02-02', assigned: ['35'] },
    { id: 19, title: 'Escrever manual do utilizador', type: 'task', status: 'Criado', priority: 'LOW', deadline: '2026-03-15', assigned: [] },
    { id: 20, title: 'Implementar sistema de permissões granular', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-19', assigned: ['2', '12', '18'] },
    { id: 21, title: 'Backup automático da base de dados', type: 'task', status: 'Criado', priority: 'HIGH', deadline: '2026-02-07', assigned: ['11'] },
    { id: 22, title: 'Erro na validação de formulários', type: 'bug', status: 'Em Progresso', priority: 'MEDIUM', deadline: '2026-02-04', assigned: ['23'] },
    { id: 23, title: 'Melhorar performance da busca', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-21', assigned: [] },
    { id: 24, title: 'Integração com sistema de pagamento', type: 'task', status: 'Em Progresso', priority: 'CRITICAL', deadline: '2026-02-16', assigned: ['7', '27'] },
    { id: 25, title: 'Implementar 2FA - autenticação de dois fatores', type: 'task', status: 'Criado', priority: 'HIGH', deadline: '2026-02-26', assigned: [] },
    { id: 26, title: 'Atualizar dependências do projeto', type: 'task', status: 'Criado', priority: 'LOW', deadline: '2026-03-01', assigned: ['34'] },
    { id: 27, title: 'Erro ao fazer logout de utilizador', type: 'bug', status: 'Atribuído', priority: 'HIGH', deadline: '2026-02-03', assigned: ['31'] },
    { id: 28, title: 'Criar páginas de ajuda e FAQ', type: 'task', status: 'Criado', priority: 'LOW', deadline: '2026-03-10', assigned: [] },
    { id: 29, title: 'Implementar webhooks para eventos', type: 'task', status: 'Em Progresso', priority: 'MEDIUM', deadline: '2026-02-24', assigned: ['9', '33'] },
    { id: 30, title: 'Otimizar CSS e reduzir tamanho do bundle', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-27', assigned: ['28'] },
    { id: 31, title: 'Configurar CI/CD com GitHub Actions', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-13', assigned: ['4', '32'] },
    { id: 32, title: 'Problema com autoscale de servidores', type: 'bug', status: 'Em Progresso', priority: 'CRITICAL', deadline: '2026-02-05', assigned: ['24'] },
    { id: 33, title: 'Implementar logging centralizado', type: 'task', status: 'Criado', priority: 'MEDIUM', deadline: '2026-02-23', assigned: [] }
  ];
  private nextId = 34;

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

  // Creates a new task (uses BugTask class for bug type tasks)
  addTask(title: string, type: string, deadline?: string): ExtendedTask {
    let task: ExtendedTask;
    
    // use BugTask for bug-type tasks
    if (type.toLowerCase() === 'bug') {
      const bugTask = new BugTask(this.nextId++, title);
      task = {
        id: bugTask.id,
        title: bugTask.title,
        type,
        status: bugTask.status,
        deadline
      };
    } else {
      task = {
        id: this.nextId++,
        title,
        type,
        status: TaskStatus.CREATED,
        deadline
      };
    }
    
    this.tasks.push(task);
    return task;
  }

  // updates task status
  updateTaskStatus(id: number, status: string): void {
    const task = this.getTaskById(id);
    if (task) task.status = status;
  }

  // updates task title
  updateTaskTitle(id: number, title: string): void {
    const task = this.getTaskById(id);
    if (task) task.title = title;
  }

  // updates task priority level
  updateTaskPriority(id: number, priority: string): void {
    const task = this.getTaskById(id);
    if (task) task.priority = priority;
  }

  // updates task deadline date
  updateTaskDeadline(id: number, deadline: string): void {
    const task = this.getTaskById(id);
    if (task) task.deadline = deadline;
  }

  // assigns a user to a task by email
  assignUser(taskId: number, email: string): void {
    const task = this.getTaskById(taskId);
    if (task) {
      if (!task.assigned) task.assigned = [];
      if (!task.assigned.includes(email)) {
        task.assigned.push(email);
      }
    }
  }

  //removes a user assignment from a task
  unassignUser(taskId: number, email: string): void {
    const task = this.getTaskById(taskId);
    if (task && task.assigned) {
      task.assigned = task.assigned.filter(e => e !== email);
    }
  }

  //deletes a task by ID
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}
