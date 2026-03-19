// ===== MAIN APPLICATION ENTRY POINT =====
// This file bootstraps the entire application with all services and UI

// Import all services
import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { SystemLogger } from './src/logs/SystemLogger.js';
import { CommentService } from './src/services/CommentService.js';
import { AttachmentService } from './src/services/AttachmentService.js';
import { FavoriteService } from './src/services/FavoriteService.js';
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
import { EntityList } from './src/utils/EntityList.js';
import { SimpleCache } from './src/utils/SimpleCache.js';
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
    favoriteUserIds: Set<number>;
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
  favoriteService: FavoriteService;
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
  userSortState: string;
  userFilter: string;
  myAssignedTaskIds: number[];
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
const favoriteService = new FavoriteService();
const tagService = new TagManager<any>();
const automationService = new AutomationRulesService(assignmentService, deadlineService, priorityService);
const statisticsService = new StatisticsService(taskService, userService);
const searchService = new SearchService(taskService);
const backupService = new BackupService(userService, taskService, assignmentService);
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
  favoriteService,
  tagService,
  automationService,
  statisticsService,
  searchService,
  backupService,
  notificationService,
  renderUser: new RenderUser(userService),
  renderTask: new RenderTask(taskService, userService, tagService, searchService, commentService, attachmentService),
  renderModals: new RenderModals(taskService, userService),
  currentUserId: 1,
  currentUserRole: 'ADMIN',
  taskSortState: 'none',
  userSortState: 'none',
  userFilter: 'all',
  myAssignedTaskIds: [],
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
// User favorites now use Set of IDs (loaded from DB)
const favoriteUserIds = new Set<number>();

// ===== WATCHER SYSTEM =====
const watcherSystem = new WatcherSystem<Task | User, User>();

// ===== PRIORITY MANAGER =====
const priorityManager = new PriorityManager<Task | User>();

// Expose favorites, watcher system, and priority manager to window for global access
window.favoriteTasks = favoriteTasks;
window.favoriteUserIds = favoriteUserIds;
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
  // Exercício 1: Obter total de entidades
  const totalEntities = BaseEntity.getTotalEntities();

  // Exercício 5: Exibir logs do sistema
  const sysLogs = SystemLogger.getLastN(SystemLogger.count());

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
export async function initializeApp() {
  // Configurar event listeners PRIMEIRO (antes de carregar dados)
  setupEventListeners();
  setupSearchAndFilterListeners();
  
  // Tentar carregar dados do backend (não bloquear se falhar)
  try {
    await Promise.race([
      Promise.all([
        window.appContext.userService.loadUsers(),
        window.appContext.taskService.loadTasks(),
        window.appContext.favoriteService.loadUserFavorites(window.appContext.currentUserId),
        SystemLogger.loadLogs(),
        loadUserFavorites(window.appContext.currentUserId)
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]);
  } catch (error) {
    console.warn('Não foi possível carregar dados do backend. A trabalhar em modo offline.', error);
  }
  
  // Load assignments from DB for MEMBER role filtering
  if (window.appContext.currentUserRole === 'MEMBER') {
    try {
      const res = await fetch(`http://localhost:3000/assignments/user/${window.appContext.currentUserId}`);
      if (res.ok) {
        const assignments = await res.json();
        window.appContext.myAssignedTaskIds = assignments.map((a: any) => a.task_id);
        console.log('✅ Assignments carregados:', window.appContext.myAssignedTaskIds);
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível carregar assignments do backend');
    }
  }

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

// Helper to load user favorites from API
async function loadUserFavorites(userId: number): Promise<void> {
  try {
    const res = await fetch(`http://localhost:3000/user-favorites/${userId}`);
    if (res.ok) {
      const data = await res.json();
      window.favoriteUserIds.clear();
      data.forEach((fav: any) => window.favoriteUserIds.add(fav.favorite_user_id || fav.id));
      console.log(`✅ ${window.favoriteUserIds.size} user favorites carregados`);
    }
  } catch (e) {
    console.warn('⚠️ Erro ao carregar user favorites');
  }
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
async function createNewUser(email: string, name: string, role: string, photo?: string) {
  const newUser = await window.appContext.userService.addUser(email, name, role, photo);
  
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

  // User Sort A-Z
  const sortUsersAZBtn = document.getElementById('sortUsersAZ');
  console.log('sortUsersAZBtn element:', sortUsersAZBtn);
  sortUsersAZBtn?.addEventListener('click', () => {
    console.log('User Sort button clicked!');
    const states = ['none', 'asc', 'desc'];
    const current = window.appContext.userSortState || 'none';
    const nextIndex = (states.indexOf(current) + 1) % states.length;
    window.appContext.userSortState = states[nextIndex];
    
    const texts = { 'asc': '↑ A-Z', 'desc': '↓ Z-A', 'none': 'A-Z' };
    if (sortUsersAZBtn) sortUsersAZBtn.textContent = texts[window.appContext.userSortState];
    window.appContext.renderUser.render();
  });
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
    addUserForm.addEventListener('submit', async (e) => {
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
        reader.onload = async (event) => {
          await createNewUser(emailInput.value, nameInput.value, roleSelect.value, event.target?.result as string);
          (addUserForm as HTMLFormElement).reset();
          saveAndRender();
        };
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        await createNewUser(emailInput.value, nameInput.value, roleSelect.value);
        (addUserForm as HTMLFormElement).reset();
        saveAndRender();
      }
    });
  }

  const addTaskForm = document.getElementById('taskForm');
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!window.appContext.checkPermission('create_task')) {
        window.appContext.notificationService.addNotification('Sem permissão para criar tarefas!', 'warning');
        return;
      }
      
      const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
      const typeSelect = document.getElementById('taskType') as HTMLSelectElement;
      const deadlineInput = document.getElementById('taskDeadline') as HTMLInputElement;
      
      if (!titleInput?.value || !typeSelect?.value) return;
      
      const newTask = await window.appContext.taskService.addTask(titleInput.value, typeSelect.value, deadlineInput?.value);
      
      if (deadlineInput?.value) {
        window.appContext.deadlineService.setDeadline(newTask.id, new Date(deadlineInput.value));
      }
      
      // Log task creation
      SystemLogger.log(`Tarefa criada: "${newTask.title}" (${typeSelect.value})`);
      
      // Auto-configure bug tasks
      if (typeSelect.value.toLowerCase() === 'bug') {
        await window.appContext.taskService.updateTaskPriority(newTask.id, 'CRITICAL');
        const admin = window.appContext.userService.getUsers().find((u: any) => u.role === 'ADMIN' || u.role === 'MANAGER');
        if (admin) {
          await window.appContext.taskService.assignUser(newTask.id, admin.email);
          SystemLogger.log(`Bug task "${newTask.title}" atribuído a ${admin.email}`);
        }
      }
      
      window.appContext.notificationService.addNotification('Tarefa criada!');
      (addTaskForm as HTMLFormElement).reset();
      saveAndRender();
    });
  }
  
  // Global Escape key handler to close any open modals/overlays
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any dynamically created modals
      document.querySelectorAll('[id$="Modal"]:not(.hidden)').forEach(modal => {
        if (modal.id !== 'confirmModal') modal.remove();
      });
      // Close static overlays
      const overlays = ['confirmModal', 'chatConversation', 'chatPanel', 'logsPanel'];
      overlays.forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
      });
    }
  });
}

// ===== TEST EntityList CLASS =====
// Create test users and tasks BEFORE initialization
// Comentado - agora os dados vêm do backend
/*
const user1 = userService.addUser('test1@example.com', 'Test User 1', 'MEMBER');
const user2 = userService.addUser('test2@example.com', 'Test User 2', 'MEMBER');
const user3 = userService.addUser('test3@example.com', 'Test User 3', 'MEMBER');
const user4 = userService.addUser('test4@example.com', 'Test User 4', 'MANAGER');
const user5 = userService.addUser('test5@example.com', 'Test User 5', 'MEMBER');
const user6 = userService.addUser('test6@example.com', 'Test User 6', 'VIEWER');
const user7 = userService.addUser('test7@example.com', 'Test User 7', 'MEMBER');
const user8 = userService.addUser('test8@example.com', 'Test User 8', 'MEMBER');
const user9 = userService.addUser('test9@example.com', 'Test User 9', 'MANAGER');
const user10 = userService.addUser('test10@example.com', 'Test User 10', 'VIEWER');
const user11 = userService.addUser('test11@example.com', 'Test User 11', 'MEMBER');
const user12 = userService.addUser('test12@example.com', 'Test User 12', 'MEMBER');

const task1 = await taskService.addTask('Test Task 1', 'Feature');
const task2 = await taskService.addTask('Test Task 2', 'Bug');
const task3 = await taskService.addTask('Test Task 3', 'Task');
const task4 = await taskService.addTask('Test Task 4', 'Feature');
const task5 = await taskService.addTask('Test Task 5', 'Bug');
const task6 = await taskService.addTask('Test Task 6', 'Task');
const task7 = await taskService.addTask('Test Task 7', 'Feature');
const task8 = await taskService.addTask('Test Task 8', 'Bug');
const task9 = await taskService.addTask('Test Task 9', 'Task');
const task10 = await taskService.addTask('Test Task 10', 'Feature');
const task11 = await taskService.addTask('Test Task 11', 'Bug');
const task12 = await taskService.addTask('Test Task 12', 'Task');
*/

// ===== AUTH / LOGIN SYSTEM =====
const API_URL = 'http://localhost:3000';

interface AuthSession {
  token: string;
  user: { id: number; name: string; email: string; role: string; photo?: string };
}

function getSession(): AuthSession | null {
  const raw = sessionStorage.getItem('auth');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function saveSession(session: AuthSession) {
  sessionStorage.setItem('auth', JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem('auth');
}

function showLogin() {
  document.getElementById('loginPage')!.classList.remove('hidden');
  document.getElementById('appContainer')!.classList.add('hidden');
}

function showApp() {
  document.getElementById('loginPage')!.classList.add('hidden');
  document.getElementById('appContainer')!.classList.remove('hidden');
}

async function handleLogin(email: string, password: string): Promise<AuthSession> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erro ao fazer login');
  }
  
  return res.json();
}

function applySession(session: AuthSession) {
  window.appContext.currentUserId = session.user.id;
  window.appContext.currentUserRole = session.user.role;
  
  // Update greeting in navbar
  const greetingName = document.getElementById('greetingName');
  const greetingRole = document.getElementById('greetingRole');
  if (greetingName) greetingName.textContent = `Olá, ${session.user.name}`;
  if (greetingRole) greetingRole.textContent = session.user.role;
  
  // Show/hide admin-only actions
  const isAdmin = session.user.role === 'ADMIN';
  const adminActions = document.getElementById('adminActions');
  if (adminActions) {
    adminActions.style.display = ['ADMIN', 'MANAGER'].includes(session.user.role) ? '' : 'none';
  }
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.style.display = isAdmin ? '' : 'none';
  }
  const sysConfigBtn = document.getElementById('sysConfigBtn');
  if (sysConfigBtn) {
    sysConfigBtn.style.display = isAdmin ? '' : 'none';
  }
}

function setupLogout() {
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearSession();
    location.reload();
  });
}

// ===== CHAT / MESSAGING SYSTEM =====
let currentChatUserId: number | null = null;
let chatPollInterval: ReturnType<typeof setInterval> | null = null;

async function loadConversations() {
  const userId = window.appContext.currentUserId;
  const chatList = document.getElementById('chatList');
  if (!chatList) return;
  
  try {
    const res = await fetch(`${API_URL}/messages/conversations/${userId}`);
    if (!res.ok) throw new Error('Erro');
    const conversations = await res.json();
    
    if (conversations.length === 0) {
      chatList.innerHTML = `
        <div class="p-6 text-center">
          <p class="text-xs text-slate-400 mb-2">Sem conversas ainda</p>
          <p class="text-[10px] text-slate-300">Clique em "💬 Mensagem" na lista de utilizadores para iniciar uma conversa</p>
        </div>`;
      return;
    }
    
    chatList.innerHTML = conversations.map((c: any) => {
      const initial = c.name?.charAt(0).toUpperCase() || '?';
      const photoHTML = c.photo 
        ? `<img src="${c.photo}" class="w-9 h-9 rounded-full object-cover border border-slate-200">`
        : `<div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">${initial}</div>`;
      const unreadBadge = c.unread > 0 
        ? `<span class="w-5 h-5 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">${c.unread}</span>` 
        : '';
      const timeAgo = c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '';
      const preview = c.lastMessage?.length > 35 ? c.lastMessage.substring(0, 35) + '...' : (c.lastMessage || '');
      const senderPrefix = c.lastSenderId === userId ? 'Tu: ' : '';
      
      return `
        <div class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-colors"
             onclick="window.openChatWith(${c.id}, '${c.name.replace(/'/g, "\\'")}', '${c.role}')">
          ${photoHTML}
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800">${c.name}</span>
              <span class="text-[9px] text-slate-400">${timeAgo}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-slate-400 truncate">${senderPrefix}${preview}</span>
              ${unreadBadge}
            </div>
          </div>
        </div>`;
    }).join('');
  } catch {
    chatList.innerHTML = '<div class="p-4 text-center text-xs text-red-400">Erro ao carregar conversas</div>';
  }
}

async function loadUnreadBadge() {
  try {
    const res = await fetch(`${API_URL}/messages/unread/${window.appContext.currentUserId}`);
    if (!res.ok) return;
    const { count } = await res.json();
    const badge = document.getElementById('chatBadge');
    if (badge) {
      if (count > 0) {
        badge.textContent = String(count);
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  } catch { /* ignore */ }
}

async function openChatWith(userId: number, name: string, role: string) {
  currentChatUserId = userId;
  
  // Close chat panel if open
  document.getElementById('chatPanel')?.classList.add('hidden');
  
  // Open conversation modal
  const modal = document.getElementById('chatConversation')!;
  modal.classList.remove('hidden');
  
  document.getElementById('chatWithName')!.textContent = name;
  document.getElementById('chatWithRole')!.textContent = role;
  
  await loadMessages(userId);
  
  // Poll for new messages every 3 seconds
  if (chatPollInterval) clearInterval(chatPollInterval);
  chatPollInterval = setInterval(() => loadMessages(userId), 3000);
}

async function loadMessages(otherUserId: number) {
  const container = document.getElementById('chatMessages')!;
  const myId = window.appContext.currentUserId;
  
  try {
    const res = await fetch(`${API_URL}/messages/${myId}/${otherUserId}`);
    if (!res.ok) throw new Error('Erro');
    const messages = await res.json();
    
    if (messages.length === 0) {
      container.innerHTML = '<div class="text-center text-xs text-slate-400 py-8">Nenhuma mensagem ainda. Diga olá! 👋</div>';
      return;
    }
    
    container.innerHTML = messages.map((m: any) => {
      const isMine = m.sender_id === myId;
      const time = new Date(m.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="flex ${isMine ? 'justify-end' : 'justify-start'}">
          <div class="max-w-[75%] px-3 py-2 rounded-xl text-sm ${isMine ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}">
            <p>${m.content}</p>
            <p class="text-[9px] mt-1 ${isMine ? 'text-indigo-200' : 'text-slate-400'} text-right">${time}</p>
          </div>
        </div>`;
    }).join('');
    
    container.scrollTop = container.scrollHeight;
  } catch {
    container.innerHTML = '<div class="text-center text-xs text-red-400 py-4">Erro ao carregar mensagens</div>';
  }
  
  // Update unread badge
  loadUnreadBadge();
}

async function sendChatMessage() {
  if (!currentChatUserId) return;
  
  const input = document.getElementById('chatInput') as HTMLInputElement;
  const content = input.value.trim();
  if (!content) return;
  
  input.value = '';
  
  try {
    await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: window.appContext.currentUserId,
        receiver_id: currentChatUserId,
        content
      })
    });
    
    await loadMessages(currentChatUserId);
  } catch {
    window.appContext.notificationService?.addNotification('Erro ao enviar mensagem', 'warning');
  }
}

function setupChatListeners() {
  // Toggle chat panel
  const toggleChat = document.getElementById('toggleChat');
  const chatPanel = document.getElementById('chatPanel');
  const closeChatBtn = document.getElementById('closeChatPanel');
  
  toggleChat?.addEventListener('click', (e) => {
    e.stopPropagation();
    chatPanel?.classList.toggle('hidden');
    if (!chatPanel?.classList.contains('hidden')) {
      loadConversations();
    }
  });
  
  closeChatBtn?.addEventListener('click', () => chatPanel?.classList.add('hidden'));
  
  // Close chat panel on outside click
  document.addEventListener('click', (e) => {
    if (chatPanel && !chatPanel.classList.contains('hidden')) {
      const target = e.target as HTMLElement;
      if (!chatPanel.contains(target) && !toggleChat?.contains(target)) {
        chatPanel.classList.add('hidden');
      }
    }
  });
  
  // Close conversation modal
  document.getElementById('closeChatConversation')?.addEventListener('click', () => {
    document.getElementById('chatConversation')?.classList.add('hidden');
    if (chatPollInterval) { clearInterval(chatPollInterval); chatPollInterval = null; }
    currentChatUserId = null;
    loadUnreadBadge();
  });
  
  // Send message
  document.getElementById('chatSendBtn')?.addEventListener('click', sendChatMessage);
  document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

// Expose to window for onclick calls in rendered HTML
(window as any).openChatWith = openChatWith;

async function bootstrapApp() {
  const session = getSession();
  
  if (session) {
    // Already logged in — show app
    showApp();
    applySession(session);
    await initializeApp();
    setupLogout();
    setupChatListeners();
    loadUnreadBadge();
    setInterval(loadUnreadBadge, 10000);
    return;
  }
  
  // Not logged in — show login
  showLogin();
  
  const loginForm = document.getElementById('loginForm')!;
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail') as HTMLInputElement;
    const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
    const errorDiv = document.getElementById('loginError')!;
    const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
    
    errorDiv.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'A entrar...';
    
    try {
      const session = await handleLogin(emailInput.value, passwordInput.value);
      saveSession(session);
      
      showApp();
      
      // Ensure all modals and overlays are closed after login
      document.querySelectorAll('[id$="Modal"]').forEach(modal => {
        if (modal.id !== 'confirmModal') modal.remove();
      });
      const overlays = ['confirmModal', 'chatConversation', 'chatPanel', 'logsPanel'];
      overlays.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.classList.contains('hidden')) {
          el.classList.add('hidden');
        }
      });
      
      applySession(session);
      await initializeApp();
      setupLogout();
      setupChatListeners();
      loadUnreadBadge();
      setInterval(loadUnreadBadge, 10000);
    } catch (err: any) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove('hidden');
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Entrar';
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}

/*
// Código de teste comentado - usar apenas quando necessário
// test EntityList with users
const userList = new EntityList();
userList.add(user1);
userList.add(user2);
userList.add(user3);
userList.add(user4);
userList.add(user5);

// test EntityList with tasks
const taskList = new EntityList();
taskList.add(task1);
taskList.add(task2);
taskList.add(task3);
taskList.add(task4);
taskList.add(task5);

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
const cachedTask =taskCache.get('task456');

console.log('Cached User:', cachedUser);
console.log('Cached Task:', cachedTask);

// ===== TEST TagManager CLASS =====
const tagManager = new TagManager<any>();
tagManager.addTag(task1, 'urgente');
tagManager.addTag(task1, 'backend');
console.log(tagManager.getTags(task1));

//  test rarting system with tasks
const testRatingSystem = new RatingSystem<Task>();
testRatingSystem.rate(task1, 5);
testRatingSystem.rate(task1, 3);
console.log('testRatingSystem.getAverage(task1):', testRatingSystem.getAverage(task1));

// test dependency graph with tasks
const depGraph = new DependencyGraph<Task>();
depGraph.addDependency(task2, task1);
depGraph.addDependency(task3, task2);
console.log('depGraph.getDependencies(task2):', depGraph.getDependencies(task2));

// test watcher system with tasks
const testWatcherSystem = new WatcherSystem<Task, User>();
testWatcherSystem.watch(task1, user1);
testWatcherSystem.watch(task1, user2);
console.log('testWatcherSystem.getWatchers(task1):', testWatcherSystem.getWatchers(task1));

//re-render after adding test data
window.appContext.renderTask.render();
window.appContext.renderUser.render();
*/


