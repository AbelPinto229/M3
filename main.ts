import { User } from './src/models/Users.js';
import { Task } from './src/models/Task.js';
import { CommentService } from './src/services/CommentService.js';
import { AttachmentService } from './src/services/AttachmentService.js';
import { TagService } from './src/services/TagService.js';
import { DeadlineService } from './src/services/DeadlineService.js';
import { PriorityService, Priority } from './src/services/PriorityService.js';
import { AssignmentService } from './src/services/AssignmentService.js';
import { SearchService } from './src/services/SearchService.js';
import { StatisticsService } from './src/services/StatisticService.js';
import { BackupService } from './src/services/AutomationService.js';
import { AutomationRulesService } from './src/services/AutomationService.js';

// === INICIALIZAÇÃO DOS DADOS EXISTENTES DO LOCALSTORAGE ===
const stateUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
const stateTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');

// === INICIALIZAÇÃO DOS SERVIÇOS ===
const deadlineService = new DeadlineService();
const priorityService = new PriorityService();
const assignmentService = new AssignmentService();
const commentService = new CommentService();
const attachmentService = new AttachmentService();
const tagService = new TagService();
const automationService = new AutomationRulesService();
const statisticsService = new StatisticsService(stateTasks, stateUsers);
const searchService = new SearchService(stateTasks);
const backupService = new BackupService(stateUsers, stateTasks, assignmentService);

// === SINCRONIZAÇÃO COM APP.JS ===
export const syncState = () => {
  // Atualiza o localStorage
  localStorage.setItem('users', JSON.stringify(stateUsers));
  localStorage.setItem('tasks', JSON.stringify(stateTasks));
};

// === FUNÇÕES PARA CRIAR USERS E TASKS VIA TS ===
export const createUser = (email: string, role: string) => {
  if (stateUsers.some(u => u.email === email)) return false;
  const id = stateUsers.length ? Math.max(...stateUsers.map(u => u.id)) + 1 : 1;
  const user: User = { id, email, role, active: true };
  stateUsers.push(user);
  syncState();
  return user;
};

export const createTask = (title: string, type: string) => {
  const id = stateTasks.length ? Math.max(...stateTasks.map(t => t.id)) + 1 : 1;
  const task: Task = { id, title, type, status: 'Pendente' };
  stateTasks.push(task);

  // Aplica regras automáticas
  automationService.applyRules(task);

  syncState();
  return task;
};

// === FUNÇÕES DE ATUALIZAÇÃO DE STATUS ===
export const updateTaskStatus = (taskId: number) => {
  const task = stateTasks.find(t => t.id === taskId);
  if (!task) return;

  const statusCycle = ['Pendente', 'Em Progresso', 'Concluído'];
  task.status = statusCycle[(statusCycle.indexOf(task.status) + 1) % statusCycle.length];

  automationService.applyRules(task);
  syncState();
};

// === FUNÇÕES DE ATUALIZAÇÃO DE USERS ===
export const toggleUserStatus = (userId: number) => {
  const user = stateUsers.find(u => u.id === userId);
  if (!user) return;
  user.active = !user.active;
  automationService.applyUserRules(user, assignmentService);
  syncState();
};

// === FUNÇÕES DE ASSIGNMENT VIA TS ===
export const assignUserToTask = (taskId: number, userId: number) => {
  assignmentService.assignUser(taskId, userId);
};

export const unassignUserFromTask = (taskId: number, userId: number) => {
  assignmentService.unassignUser(taskId, userId);
};

// === EXEMPLO DE USO ===
// Criar users via TS
const admin = createUser('admin@example.com', 'ADMIN');
const member = createUser('member@example.com', 'MEMBER');

// Criar tasks via TS
const bug = createTask('Erro no login', 'BUG REPORT');

// Atribuir tasks
assignUserToTask(bug.id, member?.id || 0);

// Definir prioridade e deadlines
priorityService.setPriority(bug.id, Priority.HIGH);
deadlineService.setDeadline(bug.id, new Date('2026-01-30'));

// Adicionar comentário
commentService.addComment(bug.id, admin?.id || 0, 'Verificar stack trace');

// Tags
tagService.addTag(bug.id, 'urgent');

// Pesquisas
const searchResult = searchService.searchByTitle('login');

// Estatísticas
const stats = {
  totalUsers: statisticsService.countUsers(),
  totalTasks: statisticsService.countTasks(),
  completedTasks: statisticsService.countCompletedTasks()
};

console.log('Search Result:', searchResult);
console.log('Stats:', stats);
console.log('Expired Tasks:', deadlineService.getExpiredTasks());
