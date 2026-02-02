// ===== MAIN APPLICATION ENTRY POINT =====
// This file bootstraps the entire application with all services and UI

// Import all services
import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { SystemLogger } from './src/logs/SystemLogger.js';
import { CommentService } from './src/services/CommentService.js';
import { AttachmentService } from './src/services/AttachmentService.js';
import { TagManager } from './src/utils/TagManager.js';
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
import { User } from './src/models/Users.js';
import { Task } from './src/models/Task.js';
import { Paginator } from './src/utils/Paginator.js';
import { Favorites } from './src/utils/Favorites.js';
import { WatcherSystem } from './src/utils/WatcherSystem.js';
import { PriorityManager } from './src/utils/PriorityManager.js';
import { RatingSystem } from './src/utils/RatingSystem.js';
import { DependencyGraph } from './src/utils/DependencyGraph.js';
import { IdGenerator } from './src/utils/IdGenerator.js';
import { SystemConfig } from './src/services/SystemConfig.js';
import { BusinessRules } from './src/services/BusinessRules.js';
import { GlobalValidators } from './src/utils/GlobalValidators.js';
import { BaseEntity } from './src/models/BaseEntity.js';

// ===== EXTEND WINDOW TYPE =====
declare global {
  interface Window {
    appContext: AppContext;
    renderModals: RenderModals;
    favoriteTasks: Favorites<Task>;
    favoriteUsers: Favorites<User>;
    watcherSystem: WatcherSystem<Task | User, User>;
    priorityManager: PriorityManager<Task | User>;
    ratingSystem: RatingSystem<Task | User>;
    dependencyGraph: DependencyGraph<Task>;
    renderTasksWithPagination: (tasks: Task[]) => void;
    renderUsersWithPagination: (users: User[]) => void;
    systemStats: { totalEntities: number; systemLog: string[] };
  }
}
// ===== APP CONTEXT TYPE =====
interface AppContext {
  userService: UserService;
  taskService: TaskService;
  deadlineService: DeadlineService;
  priorityService: PriorityService;
  assignmentService: AssignmentService;
  commentService: CommentService;
  attachmentService: AttachmentService;
  tagService: TagManager<any>;
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
  saveData: () => void;
}

// ===== INITIALIZE SERVICES =====
const userService = new UserService();
const taskService = new TaskService();
const deadlineService = new DeadlineService();
const priorityService = new PriorityService();
const assignmentService = new AssignmentService();
const commentService = new CommentService();
const attachmentService = new AttachmentService();
const tagService = new TagManager<any>();
const automationService = new AutomationRulesService(assignmentService, deadlineService, priorityService);
const statisticsService = new StatisticsService(taskService.getTasks(), userService.getUsers());
const searchService = new SearchService(taskService.getTasks());
const backupService = new BackupService(userService.getUsers(), taskService.getTasks(), assignmentService);
const notificationService = new NotificationService();
const ratingSystem = new RatingSystem<Task | User>();
const dependencyGraph = new DependencyGraph<Task>();

// ===== CREATE APP CONTEXT =====
const appContext: AppContext = {
  userService,
  taskService,
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
      'edit_title': ['ADMIN', 'MANAGER', 'MEMBER'],
      'open_edit_modal': ['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'],
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
    renderSystemStats();
  },
  saveData: function() {
    updateDashboard();
    renderLogs();
    renderSystemStats();
  }
};

// Expose to window
window.appContext = appContext;
window.renderModals = appContext.renderModals;
window.ratingSystem = ratingSystem;

// ===== PAGINATION STATE =====
const paginator = new Paginator();

// ===== FAVORITES STATE =====
const favoriteTasks = new Favorites<Task>();
const favoriteUsers = new Favorites<User>();

// ===== WATCHER SYSTEM =====
const watcherSystem = new WatcherSystem<Task | User, User>();

// ===== PRIORITY MANAGER =====
const priorityManager = new PriorityManager<Task | User>();

// Expose favorites, watcher system, and priority manager to window for global access
window.favoriteTasks = favoriteTasks;
window.favoriteUsers = favoriteUsers;
window.watcherSystem = watcherSystem;
window.priorityManager = priorityManager;
window.ratingSystem = ratingSystem;
window.dependencyGraph = dependencyGraph;

interface PaginationState {
  currentPage: number;
  pageSize: number;
  filteredItems: any[];
  allItemsLoaded: any[];
}

const taskPaginationState: PaginationState = {
  currentPage: 1,
  pageSize: 10,
  filteredItems: [],
  allItemsLoaded: []
};

const userPaginationState: PaginationState = {
  currentPage: 1,
  pageSize: 10,
  filteredItems: [],
  allItemsLoaded: []
};

// ===== PAGINATION FUNCTIONS FOR TASKS =====
function renderTasksWithPagination(filteredTasks: any[]) {
  taskPaginationState.filteredItems = filteredTasks;
  taskPaginationState.currentPage = 1;
  taskPaginationState.allItemsLoaded = [];
  
  loadTaskPage();
  updateTaskPaginationControls();
}

function loadTaskPage() {
  const paginatedTasks = paginator.paginate(
    taskPaginationState.filteredItems,
    taskPaginationState.currentPage,
    taskPaginationState.pageSize
  );
  
  const taskList = document.getElementById('taskList');
  if (taskList) {
    taskList.innerHTML = paginatedTasks
      .map((task: any) => window.appContext.renderTask.renderTaskRow(task))
      .join('');
  }
  
  updateTaskPaginationControls();
}

function updateTaskPaginationControls() {
  const prevBtn = document.getElementById('taskPrevBtn') as HTMLButtonElement;
  const nextBtn = document.getElementById('taskNextBtn') as HTMLButtonElement;
  const pageInfo = document.getElementById('taskPageInfo');
  
  const totalPages = Math.ceil(taskPaginationState.filteredItems.length / taskPaginationState.pageSize);
  
  if (pageInfo) {
    pageInfo.textContent = `Página ${taskPaginationState.currentPage} de ${totalPages}`;
  }
  
  if (prevBtn) {
    prevBtn.disabled = taskPaginationState.currentPage <= 1;
    prevBtn.onclick = () => {
      if (taskPaginationState.currentPage > 1) {
        taskPaginationState.currentPage--;
        loadTaskPage();
      }
    };
  }
  
  if (nextBtn) {
    nextBtn.disabled = taskPaginationState.currentPage >= totalPages;
    nextBtn.onclick = () => {
      if (taskPaginationState.currentPage < totalPages) {
        taskPaginationState.currentPage++;
        loadTaskPage();
      }
    };
  }
}

function setupTaskScrollListener() {
  // No longer needed with page-based pagination
}

// ===== PAGINATION FUNCTIONS FOR USERS =====
function renderUsersWithPagination(filteredUsers: any[]) {
  userPaginationState.filteredItems = filteredUsers;
  userPaginationState.currentPage = 1;
  userPaginationState.allItemsLoaded = [];
  
  loadUserPage();
  updateUserPaginationControls();
}

function loadUserPage() {
  const paginatedUsers = paginator.paginate(
    userPaginationState.filteredItems,
    userPaginationState.currentPage,
    userPaginationState.pageSize
  );
  
  const userList = document.getElementById('userList');
  if (userList) {
    userList.innerHTML = paginatedUsers
      .map((user: any) => window.appContext.renderUser.renderUserRow(user))
      .join('');
  }
  
  updateUserPaginationControls();
}

function updateUserPaginationControls() {
  const prevBtn = document.getElementById('userPrevBtn') as HTMLButtonElement;
  const nextBtn = document.getElementById('userNextBtn') as HTMLButtonElement;
  const pageInfo = document.getElementById('userPageInfo');
  
  const totalPages = Math.ceil(userPaginationState.filteredItems.length / userPaginationState.pageSize);
  
  if (pageInfo) {
    pageInfo.textContent = `Página ${userPaginationState.currentPage} de ${totalPages}`;
  }
  
  if (prevBtn) {
    prevBtn.disabled = userPaginationState.currentPage <= 1;
    prevBtn.onclick = () => {
      if (userPaginationState.currentPage > 1) {
        userPaginationState.currentPage--;
        loadUserPage();
      }
    };
  }
  
  if (nextBtn) {
    nextBtn.disabled = userPaginationState.currentPage >= totalPages;
    nextBtn.onclick = () => {
      if (userPaginationState.currentPage < totalPages) {
        userPaginationState.currentPage++;
        loadUserPage();
      }
    };
  }
}

// Expose to window
window.renderTasksWithPagination = renderTasksWithPagination;
window.renderUsersWithPagination = renderUsersWithPagination

// ===== INITIALIZE GLOBAL SYSTEMS (Exercícios 1-7) =====
function initializeGlobalSystems() {
  // Exercício 2: Configurar sistema
  SystemConfig.set('environment', 'production');
  SystemConfig.set('debugMode', false);
  const sysInfo = SystemConfig.getInfo();
  SystemLogger.log(`Sistema inicializado: ${sysInfo.appName} v${sysInfo.version} (${sysInfo.environment})`);

  // Exercício 3: Gerar alguns IDs
  const id1 = IdGenerator.generate();
  const id2 = IdGenerator.generate();
  const id3 = IdGenerator.generate();
  SystemLogger.log(`IDs gerados: ${id1}, ${id2}, ${id3}`);

  // Exercício 6: Validar dados
  const testEmail = 'user@example.com';
  const testTitle = 'Nova Tarefa de Teste';
  const invalidEmail = 'invalid-email';
  const isEmailValid = GlobalValidators.isValidEmail(testEmail);
  const isInvalidEmailValid = GlobalValidators.isValidEmail(invalidEmail);
  const isTitleValid = BusinessRules.isValidTitle(testTitle);
  const isNonEmptyValid = GlobalValidators.isNonEmpty(testTitle);
  SystemLogger.log(`Email "${testEmail}" válido: ${isEmailValid}`);
  SystemLogger.log(`Email "${invalidEmail}" válido: ${isInvalidEmailValid}`);
  SystemLogger.log(`Título "${testTitle}" válido: ${isTitleValid}`);
  SystemLogger.log(`Texto não vazio: ${isNonEmptyValid}`);

  // Exercício 4: Aplicar regras de negócio
  const canDeactivate = BusinessRules.canUserBeDeactivated(0);
  const canComplete = BusinessRules.canTaskBeCompleted(false);
  const canAssign = BusinessRules.canAssignTask(true);
  const isValidPriority = BusinessRules.isValidPriority('HIGH');
  const isValidRole = BusinessRules.isValidRole('ADMIN');
  SystemLogger.log(`Utilizador pode ser desativado (0 tarefas): ${canDeactivate}`);
  SystemLogger.log(`Tarefa pode ser concluída (não bloqueada): ${canComplete}`);
  SystemLogger.log(`Tarefa pode ser atribuída (utilizador ativo): ${canAssign}`);
  SystemLogger.log(`Prioridade "HIGH" válida: ${isValidPriority}`);
  SystemLogger.log(`Role "ADMIN" válida: ${isValidRole}`);

  // Exercício 1: Obter total de entidades
  const totalEntities = BaseEntity.getTotalEntities();
  SystemLogger.log(`Total de entidades no sistema: ${totalEntities}`);

  // Exercício 5: Exibir logs do sistema
  const sysLogs = SystemLogger.getLastN(SystemLogger.count());
  SystemLogger.log(`Total de logs do sistema: ${sysLogs.length}`);

  // Guardar estatísticas no window para UI
  window.systemStats = {
    totalEntities,
    systemLog: sysLogs
  };

  // Renderizar painel de sistema
  renderSystemStats();
}

// Logs notification counter (global state)
let unreadLogsCount = 0;
let lastSeenLogCount = 0;

// Function to update logs badge
function updateLogsBadge() {
  const logsBadge = document.getElementById('logsBadge');
  if (logsBadge && window.systemStats?.systemLog) {
    const currentLogCount = window.systemStats.systemLog.length;
    unreadLogsCount = currentLogCount - lastSeenLogCount;
    
    if (unreadLogsCount > 0) {
      logsBadge.textContent = unreadLogsCount > 99 ? '99+' : unreadLogsCount.toString();
      logsBadge.classList.remove('hidden');
    } else {
      logsBadge.classList.add('hidden');
    }
  }
}

// Renderizar painel com estatísticas do sistema
function renderSystemStats() {
  // Atualizar stats com os logs atuais
  const sysLogs = SystemLogger.getLastN(SystemLogger.count());
  window.systemStats = {
    totalEntities: BaseEntity.getTotalEntities(),
    systemLog: sysLogs
  };

  const logsContent = document.getElementById('logsContent');
  if (logsContent && window.systemStats?.systemLog) {
    logsContent.innerHTML = [...window.systemStats.systemLog]
      .reverse()
      .map((log: string) => {
        const timeMatch = log.match(/\[([\d:]+)\]/);
        const time = timeMatch ? timeMatch[1] : '';
        const message = log.replace(/\[[\d:]+\]\s/, '');
        return `<div class="flex gap-3">
          <div class="flex flex-col items-center">
            <div class="w-2 h-2 rounded-full bg-slate-300 mt-1"></div>
          </div>
          <div class="flex-1">
            <div class="text-[9px] font-semibold text-slate-700">${message}</div>
            <div class="text-[8px] text-slate-400 mt-0.5">${time}</div>
          </div>
        </div>`;
      })
      .join('');
    
    // Update logs badge
    updateLogsBadge();
  }

  const statsPanel = document.getElementById('statsContent');
  if (!statsPanel) return;

  const sysInfo = SystemConfig.getInfo();
  const stats = window.systemStats;

  // ID Generator Stats
  const idGeneratorHtml = `
    <div class="flex justify-between">
      <span>Contador Atual:</span>
      <span class="font-bold text-purple-600">${IdGenerator.getCounter()}</span>
    </div>
  `;

  // Business Rules Stats
  const businessRulesHtml = `
    <div class="flex justify-between">
      <span>Regras Ativas:</span>
      <span class="font-bold text-blue-600">6</span>
    </div>
    <div class="text-[9px] space-y-1 mt-2 pl-2 border-l-2 border-blue-200">
      <div>✓ Validação de Título (5-100 chars)</div>
      <div>✓ Validação de Prioridade</div>
      <div>✓ Validação de Role</div>
      <div>✓ Tarefa Concluída (não bloqueada)</div>
      <div>✓ Tarefa Atribuída (user ativo)</div>
      <div>✓ Desativação de User (0 tarefas)</div>
    </div>
  `;

  // Global Validators Stats
  const globalValidatorsHtml = `
    <div class="flex justify-between">
      <span>Validadores Disponíveis:</span>
      <span class="font-bold text-green-600">7</span>
    </div>
    <div class="text-[9px] space-y-1 mt-2 pl-2 border-l-2 border-green-200">
      <div>✓ Email Validation</div>
      <div>✓ Non-Empty Text</div>
      <div>✓ Positive Numbers</div>
      <div>✓ Min/Max Length</div>
      <div>✓ URL Validation</div>
      <div>✓ Date Validation</div>
      <div>✓ Text Trimming</div>
    </div>
  `;

  // Render ID Generator
  const idGenEl = document.getElementById('idGeneratorStats');
  if (idGenEl) idGenEl.innerHTML = idGeneratorHtml;

  // Render Business Rules
  const busRulesEl = document.getElementById('businessRulesStats');
  if (busRulesEl) busRulesEl.innerHTML = businessRulesHtml;

  // Render Global Validators
  const validatorsEl = document.getElementById('globalValidatorsStats');
  if (validatorsEl) validatorsEl.innerHTML = globalValidatorsHtml;
}

// ===== APPLICATION INITIALIZATION =====
export function initializeApp() {
  setupEventListeners();
  setupSearchAndFilterListeners();
  updateDashboard();
  window.appContext.renderUser.render();
  window.appContext.renderTask.render();
  renderLogs();
  
  // ===== INTEGRAÇÃO DOS 7 EXERCÍCIOS =====
  initializeGlobalSystems();
  
  console.log('Application initialized successfully');
}

// Helper to update dashboard stats
function updateDashboard() {
  const taskStats = window.appContext.statisticsService.countTasks();
  const userStats = window.appContext.statisticsService.countUsers();

  console.log('Dashboard Update - Task Stats:', taskStats);
  console.log('Dashboard Update - User Stats:', userStats);

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

  // Update navbar mini stats cards
  setElementText('navbarTotalTasksCard', taskStats.total);
  setElementText('navbarPendingTasksCard', taskStats.pending);
  
  // Update status navbar full-size stats cards
  setElementText('statusTotalTasksCard', taskStats.total);
  setElementText('statusPendingTasksCard', taskStats.pending);
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
  
  const logs = SystemLogger.getLogs();
  
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
    SystemLogger.log(`Utilizador ${name} (${email}) criado com role ${role}`);
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
  const filterFavoritesBtn = document.getElementById('filterFavoriteTasks');
  const sortAZBtn = document.getElementById('sortTasksAZ');
  const clearCompletedBtn = document.getElementById('clearCompleted');

  const updateTaskRender = () => window.appContext.renderTask.render();
  
  searchInput?.addEventListener('input', updateTaskRender);
  filterStatus?.addEventListener('change', updateTaskRender);
  filterPriority?.addEventListener('change', updateTaskRender);
  filterTag?.addEventListener('input', updateTaskRender);
  filterFavoritesBtn?.addEventListener('click', () => {
    filterFavoritesBtn.classList.toggle('bg-yellow-200');
    filterFavoritesBtn.classList.toggle('bg-yellow-100');
    updateTaskRender();
  });
  
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
  const filterFavoriteUsersBtn = document.getElementById('filterFavoriteUsers');
  const userSearchInput = document.getElementById('searchUser');

  const setUserFilter = (filter: string) => {
    window.appContext.userFilter = filter;
    setFilterButton(filterAllBtn, filter === 'all');
    setFilterButton(filterActiveBtn, filter === 'active');
    setFilterButton(filterInactiveBtn, filter === 'inactive');
    setFilterButton(filterFavoriteUsersBtn, filter === 'favorites');
    window.appContext.renderUser.render();
  };

  filterAllBtn?.addEventListener('click', () => setUserFilter('all'));
  filterActiveBtn?.addEventListener('click', () => setUserFilter('active'));
  filterInactiveBtn?.addEventListener('click', () => setUserFilter('inactive'));
  filterFavoriteUsersBtn?.addEventListener('click', () => setUserFilter('favorites'));
  userSearchInput?.addEventListener('input', () => window.appContext.renderUser.render());
}

// Setup event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Toggle status navbar
  const toggleStatusBtn = document.getElementById('toggleStatus');
  const statusContent = document.getElementById('statusContent');
  const statusToggleIcon = document.getElementById('statusToggleIcon');
  const toggleFiltersBtn = document.getElementById('toggleFilters');
  const filtersContent = document.getElementById('filtersContent');
  const filterToggleIcon = document.getElementById('filterToggleIcon');
  
  console.log('Status elements:', { toggleStatusBtn, statusContent, statusToggleIcon });
  
  const updateNavbarPositions = () => {
    const statusNavbar = document.getElementById('statusNavbar') as HTMLElement;
    const filterNavbar = document.getElementById('filterNavbar') as HTMLElement;
    const mainNavbar = document.querySelector('nav:first-of-type') as HTMLElement;
    
    if (statusNavbar && filterNavbar && mainNavbar) {
      const mainHeight = mainNavbar.offsetHeight;
      const statusHeight = statusNavbar.offsetHeight;
      
      statusNavbar.style.top = `${mainHeight}px`;
      filterNavbar.style.top = `${mainHeight + statusHeight}px`;
    }
  };
  
  if (toggleStatusBtn && statusContent) {
    toggleStatusBtn.addEventListener('click', () => {
      statusContent.classList.toggle('hidden');
      if (statusToggleIcon) {
        const isHidden = statusContent.classList.contains('hidden');
        statusToggleIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
      }
      
      // Update navbar positions after content changes
      setTimeout(updateNavbarPositions, 0);
    });
  }
  
  // Toggle filters navbar
  if (toggleFiltersBtn && filtersContent) {
    toggleFiltersBtn.addEventListener('click', () => {
      filtersContent.classList.toggle('hidden');
      if (filterToggleIcon) {
        const isHidden = filtersContent.classList.contains('hidden');
        filterToggleIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
      }
      
      // Update main content margin-top based on filter navbar expansion
      const mainElement = document.querySelector('main') as HTMLElement;
      const filterNavbar = document.getElementById('filterNavbar') as HTMLElement;
      if (mainElement && filterNavbar) {
        setTimeout(() => {
          const filterHeight = filterNavbar.offsetHeight;
          const statusNavbar = document.getElementById('statusNavbar') as HTMLElement;
          const mainNavbar = document.querySelector('nav:first-of-type') as HTMLElement;
          if (statusNavbar && mainNavbar) {
            const totalMargin = mainNavbar.offsetHeight + statusNavbar.offsetHeight + filterHeight - 32;
            mainElement.style.marginTop = `${totalMargin}px`;
          }
        }, 50);
      }
    });
  }
  
  // Update positions on resize
  window.addEventListener('resize', updateNavbarPositions);
  
  // Function to adjust main container margin based on filter navbar state
  const adjustMainMargin = () => {
    const mainElement = document.querySelector('main') as HTMLElement;
    const statusNavbar = document.getElementById('statusNavbar') as HTMLElement;
    const filterNavbar = document.getElementById('filterNavbar') as HTMLElement;
    const mainNavbar = document.querySelector('nav:first-of-type') as HTMLElement;
    
    if (mainElement && statusNavbar && filterNavbar && mainNavbar) {
      const mainHeight = mainNavbar.offsetHeight;
      const statusHeight = statusNavbar.offsetHeight;
      const filterHeight = filterNavbar.classList.contains('hidden') ? 0 : filterNavbar.offsetHeight;
      const totalMargin = mainHeight + statusHeight + filterHeight - 32;
      mainElement.style.marginTop = `${totalMargin}px`;
    }
  };
  
  // Initial setup
  setTimeout(updateNavbarPositions, 100);
  setTimeout(adjustMainMargin, 150);

  // Logs Panel Toggle (bell icon in navbar)
  const toggleLogsBtn = document.getElementById('toggleLogs');
  const logsPanel = document.getElementById('logsPanel');
  const closeLogsBtn = document.getElementById('closeLogsPanel');
  const logsBadge = document.getElementById('logsBadge');
  
  if (toggleLogsBtn && logsPanel) {
    toggleLogsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      logsPanel.classList.toggle('hidden');
      
      // Mark all logs as seen when panel is opened
      if (!logsPanel.classList.contains('hidden')) {
        if (window.systemStats?.systemLog) {
          lastSeenLogCount = window.systemStats.systemLog.length;
          unreadLogsCount = 0;
        }
        if (logsBadge) {
          logsBadge.classList.add('hidden');
          logsBadge.textContent = '0';
        }
      }
    });
  }
  
  if (closeLogsBtn && logsPanel) {
    closeLogsBtn.addEventListener('click', () => {
      logsPanel.classList.add('hidden');
    });
  }
  
  // Close logs panel when clicking outside
  document.addEventListener('click', (e) => {
    if (logsPanel && !logsPanel.classList.contains('hidden')) {
      const target = e.target as HTMLElement;
      if (!logsPanel.contains(target) && !toggleLogsBtn?.contains(target)) {
        logsPanel.classList.add('hidden');
      }
    }
  });

  // Initialize badge on first load - mark all existing logs as seen
  if (window.systemStats?.systemLog) {
    lastSeenLogCount = window.systemStats.systemLog.length;
  }

  // Create User button - opens modal
  const createUserBtn = document.getElementById('createUserBtn');
  if (createUserBtn) {
    createUserBtn.addEventListener('click', () => {
      if (!window.appContext.checkPermission('create_user')) {
        window.appContext.notificationService.addNotification('Sem permissão para criar utilizadores!', 'warning');
        return;
      }
      window.appContext.renderModals.openCreateUserModal();
    });
  }

  // Create Task button - opens modal
  const createTaskBtn = document.getElementById('createTaskBtn');
  if (createTaskBtn) {
    createTaskBtn.addEventListener('click', () => {
      if (!window.appContext.checkPermission('create_task')) {
        window.appContext.notificationService.addNotification('Sem permissão para criar tarefas!', 'warning');
        return;
      }
      window.appContext.renderModals.openCreateTaskModal();
    });
  }

  // System Config button - opens modal
  const sysConfigBtn = document.getElementById('sysConfigBtn');
  if (sysConfigBtn) {
    sysConfigBtn.addEventListener('click', () => {
      window.appContext.renderModals.openSystemConfigModal();
    });
  }

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
      SystemLogger.log(`Tarefa criada: "${newTask.title}" (${typeSelect.value})`);
      
      // Auto-configure bug tasks
      if (typeSelect.value.toLowerCase() === 'bug') {
        window.appContext.taskService.updateTaskPriority(newTask.id, 'CRITICAL');
        const admin = window.appContext.userService.getUsers().find((u: any) => u.role === 'ADMIN' || u.role === 'MANAGER');
        if (admin) {
          newTask.assigned = [admin.email];
          SystemLogger.log(`Bug task "${newTask.title}" atribuído a ${admin.email}`);
        }
      }
      
      window.appContext.notificationService.addNotification('Tarefa criada!');
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

