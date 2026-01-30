// ===== MAIN APPLICATION ENTRY POINT =====
// This file bootstraps the entire application with all services and UI

// Import all services
import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { HistoryLog } from './src/logs/HistoryLog.js';
import { CommentService } from './src/services/CommentService.js';
import { AttachmentService } from './src/services/AttachmentService.js';
import { TagService } from './src/services/TagService.js';
import { DeadlineService } from './src/services/DeadlineService.js';
import { PriorityService } from './src/services/PriorityService.js';
import { AssignmentService } from './src/services/AssignmentService.js';
import { SearchService } from './src/services/SearchService.js';
import { StatisticsService } from './src/services/StatisticService.js';
import { BackupService } from './src/services/BackupService.js';
import { AutomationRulesService } from './src/services/AutomationRulesService.js';
import { NotificationService } from './src/notifications/NotificationService.js';

// Import UI components
import { RenderUser } from './src/ui/renderUser.js';
import { RenderTask } from './src/ui/renderTask.js';
import { RenderModals } from './src/ui/renderModals.js';
import { EntityList } from './src/index.js';
import { SimpleCache } from './src/utils/SimpleCache.js';
import { User } from './src/models/Users.js';
import { Task } from './src/models/Task.js';

// ===== APP CONTEXT TYPE =====
interface AppContext {
  userService: UserService;
  taskService: TaskService;
  logService: HistoryLog;
  deadlineService: DeadlineService;
  priorityService: PriorityService;
  assignmentService: AssignmentService;
  commentService: CommentService;
  attachmentService: AttachmentService;
  tagService: TagService;
  automationService: AutomationRulesService;
  statisticsService: StatisticsService;
  searchService: SearchService;
  backupService: BackupService;
  notificationService: NotificationService;
  renderUser: RenderUser;
  renderTask: RenderTask;
  renderModals: RenderModals;
  currentUserId: number;
  currentUserRole: string;
  taskSortState: string;
  userFilter: string;
  checkPermission: (action: string) => boolean;
  saveAndRender: () => void;
}

declare global {
  interface Window {
    appContext: AppContext;
  }
}

// ===== INITIALIZE SERVICES =====
const userService = new UserService();
const taskService = new TaskService();
const logService = new HistoryLog();
const deadlineService = new DeadlineService();
const priorityService = new PriorityService();
const assignmentService = new AssignmentService();
const commentService = new CommentService();
const attachmentService = new AttachmentService();
const tagService = new TagService();
const automationService = new AutomationRulesService(assignmentService, deadlineService, priorityService);
const statisticsService = new StatisticsService(taskService.getTasks(), userService.getUsers());
const searchService = new SearchService(taskService.getTasks());
const backupService = new BackupService(userService.getUsers(), taskService.getTasks(), assignmentService);
const notificationService = new NotificationService();

// ===== CREATE APP CONTEXT =====
const appContext: AppContext = {
  userService,
  taskService,
  logService,
  deadlineService,
  priorityService,
  assignmentService,
  commentService,
  attachmentService,
  tagService,
  automationService,
  statisticsService,
  searchService,
  backupService,
  notificationService,
  renderUser: new RenderUser(userService),
  renderTask: new RenderTask(taskService, userService, tagService, searchService, commentService, attachmentService),
  renderModals: new RenderModals(taskService, userService),
  currentUserId: 0,
  currentUserRole: 'ADMIN',
  taskSortState: 'none',
  userFilter: 'all',
  checkPermission: function(action) {
    const role = this.currentUserRole;
    
    const permissions = {
      'create_user': ['ADMIN', 'MANAGER'],
      'create_task': ['ADMIN', 'MANAGER'],
      'edit_task': ['ADMIN', 'MANAGER', 'MEMBER'],
      'delete_task': ['ADMIN', 'MANAGER'],
      'delete_user': ['ADMIN', 'MANAGER'],
      'edit_user': ['ADMIN', 'MANAGER'],
      'assign_task': ['ADMIN', 'MANAGER'],
      'edit_title': ['ADMIN', 'MANAGER'],
      'add_comment': ['ADMIN', 'MANAGER', 'MEMBER'],
      'toggle_user': ['ADMIN', 'MANAGER'],
      'view_all': ['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER']
    };
    
    return permissions[action]?.includes(role) || false;
  },
  saveAndRender: function() {
    updateDashboard();
    this.renderUser.render();
    this.renderTask.render();
    renderLogs();
  }
};

// Expose to window
window.appContext = appContext;

// ===== APPLICATION INITIALIZATION =====
export function initializeApp() {
  setupEventListeners();
  setupSearchAndFilterListeners();
  updateDashboard();
  window.appContext.renderUser.render();
  window.appContext.renderTask.render();
  renderLogs();
  
  console.log('Application initialized successfully');
}

// Helper to update dashboard stats
function updateDashboard() {
  const taskStats = window.appContext.statisticsService.countTasks();
  const userStats = window.appContext.statisticsService.countUsers();

  // Count tasks by status (using Portuguese status names from TaskStatus enum)
  const inProgressCount = taskStats.byStatus['Em Progresso'] || 0;
  const pendingCount = taskStats.byStatus['Criado'] || taskStats.byStatus['Atribuído'] || 0;
  const completedCount = taskStats.byStatus['Concluído'] || 0;

  setElementText('totalTasks', taskStats.total);
  setElementText('pendingTasks', taskStats.pending);
  setElementText('inProgressTasks', inProgressCount);
  setElementText('pendingTasksCount', pendingCount);
  setElementText('completedTasksCount', completedCount);
  setElementText('completionRate', `${taskStats.completionRate}%`);
  setProgressBar('taskProgressBar', taskStats.completionRate);

  setElementText('totalUsers', userStats.total);
  setElementText('activeUsers', userStats.active);
  setElementText('inactiveUsers', userStats.inactive);
  setElementText('userActiveRate2', `${userStats.activeRate}%`);
  setProgressBar('userProgressBar', userStats.activeRate);
}

// Helper to set element text
function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = String(text);
}

// Helper to set progress bar
function setProgressBar(id, width) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${width}%`;
}

// Helper to save and render
export function saveAndRender() {
  window.appContext.saveAndRender();
}

// Helper to render logs
function renderLogs() {
  const logsContainer = document.getElementById('logs');
  if (!logsContainer) return;
  
  const logs = window.appContext.logService.getLogs();
  
  logsContainer.innerHTML = logs
    .slice()
    .reverse()
    .map((log: any) => {
      const time = log.timestamp instanceof Date 
        ? log.timestamp.toLocaleTimeString('pt-PT')
        : new Date(log.timestamp).toLocaleTimeString('pt-PT');
      return `
        <div class="text-[10px] text-slate-600 leading-relaxed">
          <span class="text-slate-400">${time}</span><br>
          <span class="text-slate-700 font-medium">${log.message}</span>
        </div>
      `;
    })
    .join('');
}

// Helper to update filter button styles
function setFilterButton(btn, active) {
  if (!btn) return;
  if (active) {
    btn.classList.add('bg-indigo-600', 'text-white');
    btn.classList.remove('bg-slate-100', 'text-slate-700');
  } else {
    btn.classList.remove('bg-indigo-600', 'text-white');
    btn.classList.add('bg-slate-100', 'text-slate-700');
  }
}

// Helper to create a user
function createNewUser(email: string, name: string, role: string, photo?: string) {
  const newUser = window.appContext.userService.addUser(email, name, role, photo);
  
  if (newUser) {
    window.appContext.logService.addLog(`Utilizador ${name} (${email}) criado com role ${role}`);
    window.appContext.notificationService.addNotification('Utilizador adicionado!', 'success');
    window.appContext.notificationService.notifyAdmins(`Novo utilizador criado: ${email}`);
  } else {
    window.appContext.notificationService.addNotification('Email já existe!', 'warning');
  }
}

// Setup search and filter listeners
function setupSearchAndFilterListeners() {
  // Role selector
  const roleSelector = document.getElementById('roleSelector');
  if (roleSelector) {
    roleSelector.addEventListener('change', (e) => {
      window.appContext.currentUserRole = (e.target as HTMLSelectElement).value;
      saveAndRender();
    });
  }

  // Task search and filter inputs
  const searchInput = document.getElementById('searchTask');
  const filterStatus = document.getElementById('filterStatus');
  const filterPriority = document.getElementById('filterPriority');
  const filterTag = document.getElementById('filterTag');
  const sortAZBtn = document.getElementById('sortTasksAZ');
  const clearCompletedBtn = document.getElementById('clearCompleted');

  const updateTaskRender = () => window.appContext.renderTask.render();
  
  searchInput?.addEventListener('input', updateTaskRender);
  filterStatus?.addEventListener('change', updateTaskRender);
  filterPriority?.addEventListener('change', updateTaskRender);
  filterTag?.addEventListener('input', updateTaskRender);
  
  sortAZBtn?.addEventListener('click', () => {
    const states = ['none', 'asc', 'desc'];
    const current = window.appContext.taskSortState || 'none';
    const nextIndex = (states.indexOf(current) + 1) % states.length;
    window.appContext.taskSortState = states[nextIndex];
    
    const texts = { 'asc': '↑ A-Z', 'desc': '↓ Z-A', 'none': 'Sort A-Z' };
    if (sortAZBtn) sortAZBtn.textContent = texts[window.appContext.taskSortState];
    window.appContext.renderTask.render();
  });
  
  clearCompletedBtn?.addEventListener('click', () => {
    const completedTasks = window.appContext.taskService.getTasks().filter((t: any) => t.status === 'Concluído');
    completedTasks.forEach((t: any) => window.appContext.taskService.deleteTask(t.id));
    window.appContext.notificationService.addNotification(`${completedTasks.length} tarefas removidas!`, 'success');
    saveAndRender();
  });

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  exportBtn?.addEventListener('click', () => {
    const exportedData = window.appContext.backupService.exportAll();
    const jsonString = JSON.stringify(exportedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.appContext.notificationService.addNotification('Dados exportados com sucesso!', 'success');
  });

  // User filter buttons
  const filterAllBtn = document.getElementById('filterAllUsers');
  const filterActiveBtn = document.getElementById('filterActiveUsers');
  const filterInactiveBtn = document.getElementById('filterInactiveUsers');
  const userSearchInput = document.getElementById('searchUser');

  const setUserFilter = (filter: string) => {
    window.appContext.userFilter = filter;
    setFilterButton(filterAllBtn, filter === 'all');
    setFilterButton(filterActiveBtn, filter === 'active');
    setFilterButton(filterInactiveBtn, filter === 'inactive');
    window.appContext.renderUser.render();
  };

  filterAllBtn?.addEventListener('click', () => setUserFilter('all'));
  filterActiveBtn?.addEventListener('click', () => setUserFilter('active'));
  filterInactiveBtn?.addEventListener('click', () => setUserFilter('inactive'));
  userSearchInput?.addEventListener('input', () => window.appContext.renderUser.render());
}

// Setup event listeners
function setupEventListeners() {
  const addUserForm = document.getElementById('userForm');
  if (addUserForm) {
    addUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!window.appContext.checkPermission('create_user')) {
        window.appContext.notificationService.addNotification('Sem permissão para criar utilizadores!', 'warning');
        return;
      }
      
      const nameInput = document.getElementById('userName') as HTMLInputElement;
      const emailInput = document.getElementById('userEmail') as HTMLInputElement;
      const roleSelect = document.getElementById('userRole') as HTMLSelectElement;
      const photoInput = document.getElementById('userPhoto') as HTMLInputElement;
      
      if (!nameInput?.value || !emailInput?.value || !roleSelect?.value) return;
      
      // Handle photo if selected
      if (photoInput?.files?.length) {
        const reader = new FileReader();
        reader.onload = (event) => {
          createNewUser(emailInput.value, nameInput.value, roleSelect.value, event.target?.result as string);
          (addUserForm as HTMLFormElement).reset();
          saveAndRender();
        };
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        createNewUser(emailInput.value, nameInput.value, roleSelect.value);
        (addUserForm as HTMLFormElement).reset();
        saveAndRender();
      }
    });
  }

  const addTaskForm = document.getElementById('taskForm');
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!window.appContext.checkPermission('create_task')) {
        window.appContext.notificationService.addNotification('Sem permissão para criar tarefas!', 'warning');
        return;
      }
      
      const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
      const typeSelect = document.getElementById('taskType') as HTMLSelectElement;
      const deadlineInput = document.getElementById('taskDeadline') as HTMLInputElement;
      
      if (!titleInput?.value || !typeSelect?.value) return;
      
      const newTask = window.appContext.taskService.addTask(titleInput.value, typeSelect.value, deadlineInput?.value);
      
      if (deadlineInput?.value) {
        window.appContext.deadlineService.setDeadline(newTask.id, new Date(deadlineInput.value));
      }
      
      // Log task creation
      window.appContext.logService.addLog(`Tarefa criada: "${newTask.title}" (${typeSelect.value})`);
      
      // Auto-configure bug tasks
      if (typeSelect.value.toLowerCase() === 'bug') {
        window.appContext.taskService.updateTaskPriority(newTask.id, 'CRITICAL');
        const admin = window.appContext.userService.getUsers().find((u: any) => u.role === 'ADMIN' || u.role === 'MANAGER');
        if (admin) {
          newTask.assigned = [admin.email];
          window.appContext.logService.addLog(`Bug task "${newTask.title}" atribuído a ${admin.email}`);
        }
      }
      
      window.appContext.notificationService.addNotification('Tarefa criada!');
      (addTaskForm as HTMLFormElement).reset();
      saveAndRender();
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// ===== TEST EntityList CLASS =====
// Create test users and tasks
const user1 = userService.addUser('test1@example.com', 'Test User 1', 'MEMBER');
const user2 = userService.addUser('test2@example.com', 'Test User 2', 'MEMBER');
const task1 = taskService.addTask('Test Task 1', 'Feature');

// test EntityList with users
const userList = new EntityList();
userList.add(user1);
userList.add(user2);

// test EntityList with tasks
const taskList = new EntityList();
taskList.add(task1);

console.log('Users in EntityList:', userList.getAll());
console.log('Tasks in EntityList:', taskList.getAll());

// ===== TEST SimpleCache CLASS =====
// cache for users by id
const userCache = new SimpleCache<string, User>();
const userData = user1;
userCache.set('user123', userData);
const cachedUser = userCache.get('user123');

// cache for tasks by id
const taskCache = new SimpleCache<string, Task>();
const taskData = task1;
taskCache.set('task456', taskData);
const cachedTask = taskCache.get('task456');

console.log('Cached User:', cachedUser);
console.log('Cached Task:', cachedTask);
