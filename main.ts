import { User } from './src/models/Users.js';
import { Task } from './src/models/ask.js';

import { CommentService } from './src/services/CommentService.js';
import { AttachmentService } from './src/services/AttachmentService.js';
import { TagService } from './src/services/TagService.js';
import { DeadlineService } from './src/services/DeadlineService.js';
import { PriorityService, Priority } from './src/services/PriorityService.js';
import { AssignmentService } from './src/services/AssignmentService.js';
import { SearchService } from './src/services/SearchService.js';
import { StatisticsService } from './src/services/StatisticService.js';
import { BackupService } from './src/services/BackupService.js';
import { AutomationRulesService } from './src/services/AutomationService.js';

// === ESTADO EM MEMÓRIA ===
const stateUsers: User[] = [];
const stateTasks: Task[] = [];

// === SERVIÇOS ===
const deadlineService = new DeadlineService();
const priorityService = new PriorityService();
const assignmentService = new AssignmentService();
const commentService = new CommentService();
const attachmentService = new AttachmentService();
const tagService = new TagService();
const automationService = new AutomationRulesService(assignmentService, deadlineService);
const statisticsService = new StatisticsService(stateTasks, stateUsers);
const searchService = new SearchService(stateTasks);
const backupService = new BackupService(stateUsers, stateTasks, assignmentService);

// === CRIAR USER ===
// Corrigido: Retorna User | null para permitir o uso de optional chaining (?.)
export const createUser = (email: string, role: string): User | null => {
  if (stateUsers.some(u => u.email === email)) return null;
  
  const id = stateUsers.length ? Math.max(...stateUsers.map(u => u.id)) + 1 : 1;
  const user: User = { id, email, role, active: true };
  stateUsers.push(user);

  automationService.applyUserRules(user);
  return user;
};

// === CRIAR TASK ===
export const createTask = (title: string, type: string): Task => {
  const id = stateTasks.length ? Math.max(...stateTasks.map(t => t.id)) + 1 : 1;
  const task: Task = { id, title, type, status: 'Pendente' };
  stateTasks.push(task);

  automationService.applyRules(task);
  return task;
};

// === MUDAR STATUS DA TASK ===
export const updateTaskStatus = (taskId: number) => {
  const task = stateTasks.find(t => t.id === taskId);
  if (!task) return;

  const statusCycle = ['Pendente', 'Em Progresso', 'Concluído'];
  const currentIndex = statusCycle.indexOf(task.status);
  task.status = statusCycle[(currentIndex + 1) % statusCycle.length] as any;

  automationService.applyRules(task);
};

// === ATIVAR / DESATIVAR USER ===
export const toggleUserStatus = (userId: number) => {
  const user = stateUsers.find(u => u.id === userId);
  if (!user) return;

  user.active = !user.active;
  automationService.applyUserRules(user);
};

// === ASSIGNMENTS ===
export const assignUserToTask = (taskId: number, userId: number) => {
  assignmentService.assignUser(taskId, userId);
};

export const unassignUserFromTask = (taskId: number, userId: number) => {
  assignmentService.unassignUser(taskId, userId);
};

// === EXEMPLO DE USO ===
// Agora o 'admin' e o 'member' podem ser User ou null
const admin = createUser('admin@example.com', 'ADMIN');
const member = createUser('member@example.com', 'MEMBER');

const bug = createTask('Erro no login', 'BUG REPORT');

// Com o retorno sendo null, o member?.id já funciona perfeitamente!
assignUserToTask(bug.id, member?.id || 0);

priorityService.setPriority(bug.id, Priority.HIGH);
deadlineService.setDeadline(bug.id, new Date('2026-01-30'));

// O mesmo para o admin?.id
commentService.addComment(bug.id, admin?.id || 0, 'Verificar stack trace');
tagService.addTag(bug.id, 'urgent');

const searchResult = searchService.searchByTitle('login');

const stats = {
  totalUsers: statisticsService.countUsers(),
  totalTasks: statisticsService.countTasks(),
  completedTasks: statisticsService.countCompletedTasks()
};

console.log('Search Result:', searchResult);
console.log('Stats:', stats);
console.log('Expired Tasks:', deadlineService.getExpiredTasks());