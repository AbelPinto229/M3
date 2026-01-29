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
// ===== EXPOSE SERVICES TO WINDOW =====
window.userService = userService;
window.taskService = taskService;
window.logService = logService;
window.deadlineService = deadlineService;
window.priorityService = priorityService;
window.assignmentService = assignmentService;
window.commentService = commentService;
window.attachmentService = attachmentService;
window.tagService = tagService;
window.automationService = automationService;
window.statisticsService = statisticsService;
window.searchService = searchService;
window.backupService = backupService;
window.notificationService = notificationService;
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
window.checkPermission = function (action) {
    const role = window.currentUserRole;
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
};
// ===== APPLICATION INITIALIZATION =====
export function initializeApp() {
    setupEventListeners();
    setupSearchAndFilterListeners();
    updateDashboard();
    window.renderUser.render();
    window.renderTask.render();
    renderLogs();
    console.log('Application initialized successfully');
}
// Helper to update dashboard stats
function updateDashboard() {
    const taskStats = window.statisticsService.calculateTaskStats();
    const userStats = window.statisticsService.calculateUserStats();
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
    if (el)
        el.innerText = String(text);
}
// Helper to set progress bar
function setProgressBar(id, width) {
    const el = document.getElementById(id);
    if (el)
        el.style.width = `${width}%`;
}
// Helper to save and render
export function saveAndRender() {
    window.backupService.createBackup();
    updateDashboard();
    window.renderUser.render();
    window.renderTask.render();
    renderLogs();
}
// Expose saveAndRender to window
window.saveAndRender = saveAndRender;
// Helper to render logs
function renderLogs() {
    const logsContainer = document.getElementById('logs');
    if (!logsContainer)
        return;
    const logs = window.logService.getLogs();
    logsContainer.innerHTML = logs
        .slice()
        .reverse()
        .map((log) => `
      <div class="text-[10px] text-slate-600 leading-relaxed">
        <span class="text-slate-400">${log.timestamp}</span><br>
        <span class="text-slate-700 font-medium">${log.message}</span>
      </div>
    `)
        .join('');
}
// Helper to update filter button styles
function setFilterButton(btn, active) {
    if (!btn)
        return;
    if (active) {
        btn.classList.add('bg-indigo-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-700');
    }
    else {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    }
}
// Helper to create a user
function createNewUser(email, name, role, photo) {
    const newUser = window.userService.addUser(email, name, role, photo);
    if (newUser) {
        window.notificationService.addNotification('Utilizador adicionado!', 'success');
        window.notificationService.notifyAdmins(`Novo utilizador criado: ${email}`);
    }
    else {
        window.notificationService.addNotification('Email já existe!', 'warning');
    }
}
// Setup search and filter listeners
function setupSearchAndFilterListeners() {
    // Role selector
    const roleSelector = document.getElementById('roleSelector');
    if (roleSelector) {
        roleSelector.addEventListener('change', (e) => {
            window.currentUserRole = e.target.value;
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
    const updateTaskRender = () => window.renderTask.render();
    searchInput?.addEventListener('input', updateTaskRender);
    filterStatus?.addEventListener('change', updateTaskRender);
    filterPriority?.addEventListener('change', updateTaskRender);
    filterTag?.addEventListener('input', updateTaskRender);
    sortAZBtn?.addEventListener('click', () => {
        const states = ['none', 'asc', 'desc'];
        const current = window.taskSortState || 'none';
        const nextIndex = (states.indexOf(current) + 1) % states.length;
        window.taskSortState = states[nextIndex];
        const texts = { 'asc': '↑ A-Z', 'desc': '↓ Z-A', 'none': 'Sort A-Z' };
        if (sortAZBtn)
            sortAZBtn.textContent = texts[window.taskSortState];
        window.renderTask.render();
    });
    clearCompletedBtn?.addEventListener('click', () => {
        const completedTasks = window.taskService.getTasks().filter((t) => t.status === 'Concluído');
        completedTasks.forEach((t) => window.taskService.deleteTask(t.id));
        window.notificationService.addNotification(`${completedTasks.length} tarefas removidas!`, 'success');
        saveAndRender();
    });
    // User filter buttons
    const filterAllBtn = document.getElementById('filterAllUsers');
    const filterActiveBtn = document.getElementById('filterActiveUsers');
    const filterInactiveBtn = document.getElementById('filterInactiveUsers');
    const userSearchInput = document.getElementById('searchUser');
    const setUserFilter = (filter) => {
        window.userFilter = filter;
        setFilterButton(filterAllBtn, filter === 'all');
        setFilterButton(filterActiveBtn, filter === 'active');
        setFilterButton(filterInactiveBtn, filter === 'inactive');
        window.renderUser.render();
    };
    filterAllBtn?.addEventListener('click', () => setUserFilter('all'));
    filterActiveBtn?.addEventListener('click', () => setUserFilter('active'));
    filterInactiveBtn?.addEventListener('click', () => setUserFilter('inactive'));
    userSearchInput?.addEventListener('input', () => window.renderUser.render());
    window.userFilter = 'all';
}
// Setup event listeners
function setupEventListeners() {
    const addUserForm = document.getElementById('userForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!window.checkPermission('create_user')) {
                window.notificationService.addNotification('Sem permissão para criar utilizadores!', 'warning');
                return;
            }
            const nameInput = document.getElementById('userName');
            const emailInput = document.getElementById('userEmail');
            const roleSelect = document.getElementById('userRole');
            const photoInput = document.getElementById('userPhoto');
            if (!nameInput?.value || !emailInput?.value || !roleSelect?.value)
                return;
            // Handle photo if selected
            if (photoInput?.files?.length) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    createNewUser(emailInput.value, nameInput.value, roleSelect.value, event.target?.result);
                    addUserForm.reset();
                    saveAndRender();
                };
                reader.readAsDataURL(photoInput.files[0]);
            }
            else {
                createNewUser(emailInput.value, nameInput.value, roleSelect.value);
                addUserForm.reset();
                saveAndRender();
            }
        });
    }
    const addTaskForm = document.getElementById('taskForm');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!window.checkPermission('create_task')) {
                window.notificationService.addNotification('Sem permissão para criar tarefas!', 'warning');
                return;
            }
            const titleInput = document.getElementById('taskTitle');
            const typeSelect = document.getElementById('taskType');
            const deadlineInput = document.getElementById('taskDeadline');
            if (!titleInput?.value || !typeSelect?.value)
                return;
            const newTask = window.taskService.addTask(titleInput.value, typeSelect.value, deadlineInput?.value);
            if (deadlineInput?.value) {
                window.deadlineService.setDeadline(newTask.id, new Date(deadlineInput.value));
            }
            // Auto-configure bug tasks
            if (typeSelect.value.toLowerCase() === 'bug') {
                window.taskService.updateTaskPriority(newTask.id, 'CRITICAL');
                const admin = window.userService.getUsers().find((u) => u.role === 'ADMIN' || u.role === 'MANAGER');
                if (admin) {
                    newTask.assigned = [admin.email];
                    window.logService.addLog(`Bug task "${newTask.title}" atribuído a ${admin.email}`);
                }
            }
            window.notificationService.addNotification('Tarefa criada!');
            addTaskForm.reset();
            saveAndRender();
        });
    }
}
// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    initializeApp();
}
//# sourceMappingURL=main.js.map