// ===== MAIN APPLICATION ENTRY POINT =====
// This file bootstraps the entire application with all services and UI
// Import all services
import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { HistoryLog } from './src/logs/HistoryLog.js';
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
import { EntityList } from './src/index.js';
import { SimpleCache } from './src/utils/SimpleCache.js';
import { Paginator } from './src/utils/Paginator.js';
import { Favorites } from './src/utils/Favorites.js';
import { WatcherSystem } from './src/utils/WatcherSystem.js';
// ===== INITIALIZE SERVICES =====
const userService = new UserService();
const taskService = new TaskService();
const logService = new HistoryLog();
const deadlineService = new DeadlineService();
const priorityService = new PriorityService();
const assignmentService = new AssignmentService();
const commentService = new CommentService();
const attachmentService = new AttachmentService();
const tagService = new TagManager();
const automationService = new AutomationRulesService(assignmentService, deadlineService, priorityService);
const statisticsService = new StatisticsService(taskService.getTasks(), userService.getUsers());
const searchService = new SearchService(taskService.getTasks());
const backupService = new BackupService(userService.getUsers(), taskService.getTasks(), assignmentService);
const notificationService = new NotificationService();
// ===== CREATE APP CONTEXT =====
const appContext = {
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
    checkPermission: function (action) {
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
    saveAndRender: function () {
        updateDashboard();
        this.renderUser.render();
        this.renderTask.render();
        renderLogs();
    },
    saveData: function () {
        updateDashboard();
    }
};
// Expose to window
window.appContext = appContext;
window.renderModals = appContext.renderModals;
// ===== PAGINATION STATE =====
const paginator = new Paginator();
// ===== FAVORITES STATE =====
const favoriteTasks = new Favorites();
const favoriteUsers = new Favorites();
// ===== WATCHER SYSTEM =====
const watcherSystem = new WatcherSystem();
// Expose favorites and watcher system to window for global access
window.favoriteTasks = favoriteTasks;
window.favoriteUsers = favoriteUsers;
window.watcherSystem = watcherSystem;
const taskPaginationState = {
    currentPage: 1,
    pageSize: 5,
    filteredItems: [],
    allItemsLoaded: []
};
const userPaginationState = {
    currentPage: 1,
    pageSize: 5,
    filteredItems: [],
    allItemsLoaded: []
};
// ===== PAGINATION FUNCTIONS FOR TASKS =====
function renderTasksWithPagination(filteredTasks) {
    taskPaginationState.filteredItems = filteredTasks;
    taskPaginationState.currentPage = 1;
    taskPaginationState.allItemsLoaded = [];
    loadTaskPage();
    updateTaskPaginationControls();
}
function loadTaskPage() {
    const paginatedTasks = paginator.paginate(taskPaginationState.filteredItems, taskPaginationState.currentPage, taskPaginationState.pageSize);
    const taskList = document.getElementById('taskList');
    if (taskList) {
        taskList.innerHTML = paginatedTasks
            .map((task) => window.appContext.renderTask.renderTaskRow(task))
            .join('');
    }
    updateTaskPaginationControls();
}
function updateTaskPaginationControls() {
    const prevBtn = document.getElementById('taskPrevBtn');
    const nextBtn = document.getElementById('taskNextBtn');
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
function renderUsersWithPagination(filteredUsers) {
    userPaginationState.filteredItems = filteredUsers;
    userPaginationState.currentPage = 1;
    userPaginationState.allItemsLoaded = [];
    loadUserPage();
    updateUserPaginationControls();
}
function loadUserPage() {
    const paginatedUsers = paginator.paginate(userPaginationState.filteredItems, userPaginationState.currentPage, userPaginationState.pageSize);
    const userList = document.getElementById('userList');
    if (userList) {
        userList.innerHTML = paginatedUsers
            .map((user) => window.appContext.renderUser.renderUserRow(user))
            .join('');
    }
    updateUserPaginationControls();
}
function updateUserPaginationControls() {
    const prevBtn = document.getElementById('userPrevBtn');
    const nextBtn = document.getElementById('userNextBtn');
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
function setupUserScrollListener() {
    // No longer needed with page-based pagination
}
// Expose to window
window.renderTasksWithPagination = renderTasksWithPagination;
window.renderUsersWithPagination = renderUsersWithPagination;
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
    window.appContext.saveAndRender();
}
// Helper to render logs
function renderLogs() {
    const logsContainer = document.getElementById('logs');
    if (!logsContainer)
        return;
    const logs = window.appContext.logService.getLogs();
    logsContainer.innerHTML = logs
        .slice()
        .reverse()
        .map((log) => {
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
    const newUser = window.appContext.userService.addUser(email, name, role, photo);
    if (newUser) {
        window.appContext.logService.addLog(`Utilizador ${name} (${email}) criado com role ${role}`);
        window.appContext.notificationService.addNotification('Utilizador adicionado!', 'success');
        window.appContext.notificationService.notifyAdmins(`Novo utilizador criado: ${email}`);
    }
    else {
        window.appContext.notificationService.addNotification('Email já existe!', 'warning');
    }
}
// Setup search and filter listeners
function setupSearchAndFilterListeners() {
    // Role selector
    const roleSelector = document.getElementById('roleSelector');
    if (roleSelector) {
        roleSelector.addEventListener('change', (e) => {
            window.appContext.currentUserRole = e.target.value;
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
        if (sortAZBtn)
            sortAZBtn.textContent = texts[window.appContext.taskSortState];
        window.appContext.renderTask.render();
    });
    clearCompletedBtn?.addEventListener('click', () => {
        const completedTasks = window.appContext.taskService.getTasks().filter((t) => t.status === 'Concluído');
        completedTasks.forEach((t) => window.appContext.taskService.deleteTask(t.id));
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
    const setUserFilter = (filter) => {
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
    const addUserForm = document.getElementById('userForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!window.appContext.checkPermission('create_user')) {
                window.appContext.notificationService.addNotification('Sem permissão para criar utilizadores!', 'warning');
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
            if (!window.appContext.checkPermission('create_task')) {
                window.appContext.notificationService.addNotification('Sem permissão para criar tarefas!', 'warning');
                return;
            }
            const titleInput = document.getElementById('taskTitle');
            const typeSelect = document.getElementById('taskType');
            const deadlineInput = document.getElementById('taskDeadline');
            if (!titleInput?.value || !typeSelect?.value)
                return;
            const newTask = window.appContext.taskService.addTask(titleInput.value, typeSelect.value, deadlineInput?.value);
            if (deadlineInput?.value) {
                window.appContext.deadlineService.setDeadline(newTask.id, new Date(deadlineInput.value));
            }
            // Log task creation
            window.appContext.logService.addLog(`Tarefa criada: "${newTask.title}" (${typeSelect.value})`);
            // Auto-configure bug tasks
            if (typeSelect.value.toLowerCase() === 'bug') {
                window.appContext.taskService.updateTaskPriority(newTask.id, 'CRITICAL');
                const admin = window.appContext.userService.getUsers().find((u) => u.role === 'ADMIN' || u.role === 'MANAGER');
                if (admin) {
                    newTask.assigned = [admin.email];
                    window.appContext.logService.addLog(`Bug task "${newTask.title}" atribuído a ${admin.email}`);
                }
            }
            window.appContext.notificationService.addNotification('Tarefa criada!');
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
// ===== TEST EntityList CLASS =====
// Create test users and tasks
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
const task1 = taskService.addTask('Test Task 1', 'Feature');
const task2 = taskService.addTask('Test Task 2', 'Bug');
const task3 = taskService.addTask('Test Task 3', 'Task');
const task4 = taskService.addTask('Test Task 4', 'Feature');
const task5 = taskService.addTask('Test Task 5', 'Bug');
const task6 = taskService.addTask('Test Task 6', 'Task');
const task7 = taskService.addTask('Test Task 7', 'Feature');
const task8 = taskService.addTask('Test Task 8', 'Bug');
const task9 = taskService.addTask('Test Task 9', 'Task');
const task10 = taskService.addTask('Test Task 10', 'Feature');
const task11 = taskService.addTask('Test Task 11', 'Bug');
const task12 = taskService.addTask('Test Task 12', 'Task');
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
const userCache = new SimpleCache();
const userData = user1;
userCache.set('user123', userData);
const cachedUser = userCache.get('user123');
// cache for tasks by id
const taskCache = new SimpleCache();
const taskData = task1;
taskCache.set('task456', taskData);
const cachedTask = taskCache.get('task456');
console.log('Cached User:', cachedUser);
console.log('Cached Task:', cachedTask);
// ===== TEST TagManager CLASS =====
const tagManager = new TagManager();
tagManager.addTag(task1, 'urgente');
tagManager.addTag(task1, 'backend');
console.log(tagManager.getTags(task1));
// ===== TEST WatcherSystem CLASS =====
window.watcherSystem.watch(task1, user1);
window.watcherSystem.watch(task1, user2);
console.log('Watchers for task1:', window.watcherSystem.getWatchers(task1));
window.watcherSystem.unwatch(task1, user1);
console.log('Watchers for task1 after unwatch:', window.watcherSystem.getWatchers(task1));
//re-render after adding test data
window.appContext.renderTask.render();
window.appContext.renderUser.render();
//# sourceMappingURL=main.js.map