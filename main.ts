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
import { AutomationRulesService } from './src/services/AutomationService.js';
import { NotificationService } from './src/notifications/NotificationService.js';

// Import UI components
import { RenderUser } from './src/ui/renderUser.js';
import { RenderTask } from './src/ui/renderTask.js';
import { RenderModals } from './src/ui/renderModals.js';

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
const automationService = new AutomationRulesService(assignmentService, deadlineService);
const statisticsService = new StatisticsService(taskService.getTasks(), userService.getUsers());
const searchService = new SearchService(taskService.getTasks());
const backupService = new BackupService(userService.getUsers(), taskService.getTasks(), assignmentService);
const notificationService = new NotificationService();

// ===== EXPOSE SERVICES TO WINDOW =====
declare global {
  interface Window {
    services: any;
    renderTask: RenderTask;
    renderUser: RenderUser;
    renderModals: RenderModals;
    currentUserRole: string;
    currentUserId: number;
    saveAndRender: () => void;
    checkPermission: (action: string) => boolean;
    taskSortState: string;
    userFilter: string;
  }
}

// Create centralized service container
window.services = {
  userService,
  taskService,
  logService,
  tagService,
  searchService,
  automationService,
  priorityService,
  assignmentService,
  deadlineService,
  commentService,
  attachmentService,
  statisticsService,
  backupService,
  notificationService
};

// ===== INITIALIZE UI RENDERERS =====
window.renderUser = new RenderUser(userService);
window.renderTask = new RenderTask(taskService, userService, tagService, searchService, commentService, attachmentService);
window.renderModals = new RenderModals(taskService, userService);

// ===== INITIALIZE CURRENT USER =====
// Set current logged-in user to admin (id: 0)
window.currentUserId = 0;
window.currentUserRole = 'ADMIN';

// ===== SORT STATE =====
window.taskSortState = 'none'; // none | asc | desc

// ===== PERMISSION SYSTEM =====
window.checkPermission = function(action: string): boolean {
  const role = window.currentUserRole;
  
  const permissions: Record<string, string[]> = {
    'create_user': ['ADMIN', 'MANAGER'],
    'create_task': ['ADMIN', 'MANAGER'],
    'edit_task': ['ADMIN', 'MANAGER', 'MEMBER'],
    'delete_task': ['ADMIN', 'MANAGER'],
    'delete_user': ['ADMIN'],
    'edit_user': ['ADMIN', 'MANAGER'],
    'assign_task': ['ADMIN', 'MANAGER'],
    'edit_title': ['ADMIN', 'MANAGER'],
    'add_comment': ['ADMIN', 'MANAGER', 'MEMBER'],
    'toggle_user': ['ADMIN'],
    'view_all': ['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER']
  };
  
  return permissions[action]?.includes(role) || false;
};

// ===== APPLICATION INITIALIZATION =====
export function initializeApp(): void {
  setupEventListeners();
  setupSearchAndFilterListeners();
  updateDashboard();
  window.renderUser.render();
  window.renderTask.render();
  renderLogs();
  
  console.log('Application initialized successfully');
}

// Helper to update dashboard stats
function updateDashboard(): void {
  const taskStats = window.services.statisticsService.calculateTaskStats();
  const userStats = window.services.statisticsService.calculateUserStats();

  // Count tasks by status
  const inProgressCount = taskStats.byStatus['Em Progresso'] || 0;
  const pendingCount = taskStats.byStatus['Pendente'] || 0;
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
function setElementText(id: string, text: string | number): void {
  const el = document.getElementById(id);
  if (el) el.innerText = String(text);
}

// Helper to set progress bar
function setProgressBar(id: string, width: number): void {
  const el = document.getElementById(id);
  if (el) el.style.width = `${width}%`;
}

// Helper to save and render
export function saveAndRender(): void {
  window.services.backupService.createBackup();
  updateDashboard();
  window.renderUser.render();
  window.renderTask.render();
  renderLogs();
}

// Expose saveAndRender to window
window.saveAndRender = saveAndRender;

// Helper to render logs
function renderLogs(): void {
  const logsContainer = document.getElementById('logs');
  if (!logsContainer) return;
  
  const logs = window.services.logService.getLogs();
  logsContainer.innerHTML = logs
    .slice()
    .reverse()
    .map((log: any) => `
      <div class="text-[10px] text-slate-600 leading-relaxed">
        <span class="text-slate-400">${log.timestamp}</span><br>
        <span class="text-slate-700 font-medium">${log.message}</span>
      </div>
    `)
    .join('');
}

// Setup search and filter listeners
function setupSearchAndFilterListeners(): void {
  // Role selector
  const roleSelector = document.getElementById('roleSelector') as HTMLSelectElement;
  if (roleSelector) {
    roleSelector.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement;
      window.currentUserRole = target.value;
      console.log('Role changed to:', window.currentUserRole);
      saveAndRender();
    });
  }

  // Task search and filter inputs
  const searchInput = document.getElementById('searchTask') as HTMLInputElement;
  const filterStatus = document.getElementById('filterStatus') as HTMLSelectElement;
  const filterPriority = document.getElementById('filterPriority') as HTMLSelectElement;
  const filterTag = document.getElementById('filterTag') as HTMLInputElement;
  const sortAZBtn = document.getElementById('sortTasksAZ') as HTMLButtonElement;
  const clearCompletedBtn = document.getElementById('clearCompleted') as HTMLButtonElement;

  const updateTaskRender = () => window.renderTask.render();
  
  if (searchInput) searchInput.addEventListener('input', updateTaskRender);
  if (filterStatus) filterStatus.addEventListener('change', updateTaskRender);
  if (filterPriority) filterPriority.addEventListener('change', updateTaskRender);
  if (filterTag) filterTag.addEventListener('input', updateTaskRender);
  
  if (sortAZBtn) sortAZBtn.addEventListener('click', () => {
    const currentState = (window as any).taskSortState || 'none';
    let newState = 'asc';
    
    if (currentState === 'asc') {
      newState = 'desc';
    } else if (currentState === 'desc') {
      newState = 'none';
    }
    
    (window as any).taskSortState = newState;
    
    // Update button text
    if (newState === 'asc') {
      sortAZBtn.textContent = '↑ A-Z';
    } else if (newState === 'desc') {
      sortAZBtn.textContent = '↓ Z-A';
    } else {
      sortAZBtn.textContent = 'Sort A-Z';
    }
    
    window.renderTask.render();
  });
  
  if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', () => {
    const completedTasks = window.services.taskService.getTasks().filter((t: any) => t.status === 'Concluído');
    completedTasks.forEach((t: any) => window.services.taskService.deleteTask(t.id));
    window.services.logService.addLog(`${completedTasks.length} tarefa(s) concluída(s) removida(s)`);
    window.services.notificationService.addNotification(`${completedTasks.length} tarefas removidas!`, 'success');
    saveAndRender();
  });

  // User search and filter inputs
  const userSearchInput = document.getElementById('searchUser') as HTMLInputElement;
  const filterAllBtn = document.getElementById('filterAllUsers') as HTMLButtonElement;
  const filterActiveBtn = document.getElementById('filterActiveUsers') as HTMLButtonElement;
  const filterInactiveBtn = document.getElementById('filterInactiveUsers') as HTMLButtonElement;
  
  if (userSearchInput) userSearchInput.addEventListener('input', () => window.renderUser.render());
  
  if (filterAllBtn) filterAllBtn.addEventListener('click', () => {
    (window as any).userFilter = 'all';
    filterAllBtn.classList.add('bg-indigo-600', 'text-white');
    filterAllBtn.classList.remove('bg-slate-100', 'text-slate-700');
    filterActiveBtn?.classList.remove('bg-indigo-600', 'text-white');
    filterActiveBtn?.classList.add('bg-slate-100', 'text-slate-700');
    filterInactiveBtn?.classList.remove('bg-indigo-600', 'text-white');
    filterInactiveBtn?.classList.add('bg-slate-100', 'text-slate-700');
    window.renderUser.render();
  });
  
  if (filterActiveBtn) filterActiveBtn.addEventListener('click', () => {
    (window as any).userFilter = 'active';
    filterAllBtn?.classList.remove('bg-indigo-600', 'text-white');
    filterAllBtn?.classList.add('bg-slate-100', 'text-slate-700');
    filterActiveBtn.classList.add('bg-indigo-600', 'text-white');
    filterActiveBtn.classList.remove('bg-slate-100', 'text-slate-700');
    filterInactiveBtn?.classList.remove('bg-indigo-600', 'text-white');
    filterInactiveBtn?.classList.add('bg-slate-100', 'text-slate-700');
    window.renderUser.render();
  });
  
  if (filterInactiveBtn) filterInactiveBtn.addEventListener('click', () => {
    (window as any).userFilter = 'inactive';
    filterAllBtn?.classList.remove('bg-indigo-600', 'text-white');
    filterAllBtn?.classList.add('bg-slate-100', 'text-slate-700');
    filterActiveBtn?.classList.remove('bg-indigo-600', 'text-white');
    filterActiveBtn?.classList.add('bg-slate-100', 'text-slate-700');
    filterInactiveBtn.classList.add('bg-indigo-600', 'text-white');
    filterInactiveBtn.classList.remove('bg-slate-100', 'text-slate-700');
    window.renderUser.render();
  });
  
  // Initialize user filter
  (window as any).userFilter = 'all';
}

// Setup event listeners
function setupEventListeners(): void {
  const addUserForm = document.getElementById('userForm') as HTMLFormElement;
  if (addUserForm) {
    addUserForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      
      if (!window.checkPermission('create_user')) {
        window.services.notificationService.addNotification('Sem permissão para criar utilizadores!', 'warning');
        return;
      }
      
      const nameInput = document.getElementById('userName') as HTMLInputElement;
      const emailInput = document.getElementById('userEmail') as HTMLInputElement;
      const roleSelect = document.getElementById('userRole') as HTMLSelectElement;
      const photoInput = document.getElementById('userPhoto') as HTMLInputElement;
      
      if (nameInput?.value && emailInput?.value && roleSelect?.value) {
        // Handle photo conversion to base64 if file is selected
        if (photoInput?.files && photoInput.files.length > 0) {
          const file = photoInput.files[0];
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const photoBase64 = event.target?.result as string;
            const newUser = window.services.userService.addUser(emailInput.value, nameInput.value, roleSelect.value, photoBase64);
            
            if (newUser) {
              window.services.notificationService.addNotification('Utilizador adicionado!', 'success');
            } else {
              window.services.notificationService.addNotification('Email já existe!', 'warning');
            }
            
            addUserForm.reset();
            saveAndRender();
          };
          reader.readAsDataURL(file);
        } else {
          // No photo selected
          const newUser = window.services.userService.addUser(emailInput.value, nameInput.value, roleSelect.value);
          
          if (newUser) {
            window.services.notificationService.addNotification('Utilizador adicionado!', 'success');
          } else {
            window.services.notificationService.addNotification('Email já existe!', 'warning');
          }
          
          addUserForm.reset();
          saveAndRender();
        }
      }
    });
  } else {
    console.warn('User form not found');
  }

  const addTaskForm = document.getElementById('taskForm') as HTMLFormElement;
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      
      if (!window.checkPermission('create_task')) {
        window.services.notificationService.addNotification('Sem permissão para criar tarefas!', 'warning');
        return;
      }
      
      const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
      const typeSelect = document.getElementById('taskType') as HTMLSelectElement;
      const deadlineInput = document.getElementById('taskDeadline') as HTMLInputElement;
      
      if (titleInput?.value && typeSelect?.value) {
        const newTask = window.services.taskService.addTask(titleInput.value, typeSelect.value, deadlineInput?.value);
        
        // Apply automation rules for bug tasks
        if (typeSelect.value.toLowerCase() === 'bug') {
          // Set priority to CRITICAL
          window.services.taskService.updateTaskPriority(newTask.id, 'CRITICAL');
          
          // Assign to first admin or manager
          const adminOrManager = window.services.userService.getUsers().find(
            (u: any) => u.role === 'ADMIN' || u.role === 'MANAGER'
          );
          if (adminOrManager) {
            newTask.assigned = [adminOrManager.email];
            window.services.logService.addLog(`Bug task "${newTask.title}" atribuído a ${adminOrManager.email}`);
          }
        }
        
        window.services.logService.addLog(`Nova tarefa: "${newTask.title}"`);
        window.services.notificationService.addNotification('Tarefa criada!');
        addTaskForm.reset();
        saveAndRender();
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
