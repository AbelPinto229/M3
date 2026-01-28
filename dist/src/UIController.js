// ===== UI CONTROLLER - All DOM Operations =====
import { TaskStatus } from './tasks/TaskStatus.js';
import { RenderUser } from './ui/renderUser.js';
import { RenderTask } from './ui/renderTask.js';
import { RenderModals } from './ui/renderModals.js';
const TASK_STATUS_CYCLE = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED];
export class UIController {
    userService;
    taskService;
    logService;
    tagService;
    searchService;
    automationService;
    priorityService;
    assignmentService;
    deadlineService;
    commentService;
    attachmentService;
    statisticsService;
    backupService;
    notificationService;
    renderUser;
    renderTask;
    renderModals;
    constructor(userService, taskService, logService, tagService, searchService, automationService, priorityService, assignmentService, deadlineService, commentService, attachmentService, statisticsService, backupService, notificationService) {
        this.userService = userService;
        this.taskService = taskService;
        this.logService = logService;
        this.tagService = tagService;
        this.searchService = searchService;
        this.automationService = automationService;
        this.priorityService = priorityService;
        this.assignmentService = assignmentService;
        this.deadlineService = deadlineService;
        this.commentService = commentService;
        this.attachmentService = attachmentService;
        this.statisticsService = statisticsService;
        this.backupService = backupService;
        this.notificationService = notificationService;
        this.renderUser = new RenderUser(userService);
        this.renderTask = new RenderTask(taskService, userService, tagService, searchService, commentService, attachmentService);
        this.renderModals = new RenderModals(taskService, userService);
    }
    // ===== DASHBOARD STATS =====
    updateDashboard() {
        // Use StatisticsService to calculate stats
        const taskStats = this.statisticsService.calculateTaskStats();
        const userStats = this.statisticsService.calculateUserStats();
        this.setElementText('totalTasks', taskStats.total);
        this.setElementText('pendingTasks', taskStats.pending);
        this.setElementText('completionRate', `${taskStats.completionRate}%`);
        this.setProgressBar('taskProgressBar', taskStats.completionRate);
        this.setElementText('totalUsers', userStats.total);
        this.setElementText('activeUsers', userStats.active);
        this.setElementText('userActiveRate', `${userStats.activeRate}%`);
        this.setProgressBar('userProgressBar', userStats.activeRate);
    }
    setElementText(id, text) {
        const el = document.getElementById(id);
        if (el)
            el.innerText = String(text);
    }
    setProgressBar(id, width) {
        const el = document.getElementById(id);
        if (el)
            el.style.width = `${width}%`;
    }
    // ===== RENDER =====
    render() {
        this.renderUser.render();
        this.renderTask.render();
    }
    // ===== MODALS - Delegated to RenderModals =====
    openModal(message, confirmCallback) {
        this.renderModals.openConfirmModal(message, confirmCallback);
    }
    closeModal() {
        this.renderModals.closeConfirmModal();
    }
    confirmModalAction() {
        this.renderModals.confirmAction();
    }
    openTaskModal(taskId) {
        this.renderTask.openTaskModal(taskId);
    }
    closeTaskModal() {
        this.renderTask.closeTaskModal();
    }
    // ===== TAGS, COMMENTS, ATTACHMENTS - Delegated to RenderTask =====
    addTagToTask() {
        this.renderTask.addTag();
    }
    removeTagFromTask(tag) {
        this.renderTask.removeTag(tag);
    }
    addCommentModal() {
        this.renderTask.addComment();
        this.logService.addLog(`Novo comentário adicionado`);
    }
    deleteComment(id) {
        this.renderTask.deleteComment(id);
    }
    addAttachmentModal(event) {
        this.renderTask.addAttachment(event);
        const target = event.target;
        const file = target.files?.[0];
        if (file)
            this.logService.addLog(`Anexo "${file.name}" carregado.`);
    }
    deleteAttachment(id) {
        this.renderTask.deleteAttachment(id);
    }
    editTaskTitle(taskId) {
        this.renderModals.openEditTitleModal(taskId);
    }
    closeEditTitleModal() {
        this.renderModals.closeEditTitleModal();
    }
    saveEditTitleModal(taskId) {
        this.renderModals.saveEditTitle(taskId);
        this.saveAndRender();
    }
    // ===== USER ACTIONS - Delegated to RenderUser =====
    toggleUserStatus(id) {
        this.renderUser.toggleUserStatus(id);
        this.saveAndRender();
    }
    deleteUser(id) {
        this.renderUser.deleteUser(id);
    }
    // ===== TASK ACTIONS - Delegated to RenderTask =====
    cycleTaskStatus(id) {
        this.renderTask.cycleTaskStatus(id);
    }
    deleteTask(id) {
        this.renderTask.deleteTask(id);
    }
    manualAssign(taskId, email) {
        this.renderTask.manualAssign(taskId, email);
    }
    setTaskPriority(taskId, p) {
        this.renderTask.setTaskPriority(taskId, p);
    }
    // ===== SETUP EVENT LISTENERS =====
    setupEventListeners() {
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.onsubmit = (e) => {
                e.preventDefault();
                const email = document.getElementById('userEmail').value;
                if (this.userService.getUserByEmail(email)) {
                    this.notificationService.addNotification('Email já existe!', 'warning');
                    return;
                }
                const name = document.getElementById('userName').value;
                const role = document.getElementById('userRole').value;
                this.userService.addUser(email, name, role);
                this.logService.addLog(`Novo user: ${email}`);
                this.notificationService.addNotification('Utilizador adicionado!');
                userForm.reset();
                this.saveAndRender();
            };
        }
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.onsubmit = (e) => {
                e.preventDefault();
                const newTask = this.taskService.addTask(document.getElementById('taskTitle').value, document.getElementById('taskType').value);
                newTask.priority = 'LOW';
                newTask.deadline = document.getElementById('taskDeadline').value || undefined;
                newTask.assigned = [];
                this.automationService.applyRules(newTask);
                this.logService.addLog(`Nova tarefa: "${newTask.title}"`);
                this.notificationService.addNotification('Tarefa criada!');
                taskForm.reset();
                this.saveAndRender();
            };
        }
        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) {
            confirmBtn.onclick = () => this.confirmModalAction();
        }
        ['searchUser', 'searchTask', 'filterStatus', 'filterPriority', 'filterType', 'filterTag'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.render());
                element.addEventListener('change', () => this.render());
            }
        });
    }
    // ===== SAVE & RENDER =====
    saveAndRender() {
        this.render();
        this.updateDashboard();
        // Auto-backup after every change
        this.createBackup();
    }
    createBackup() {
        this.backupService.createBackup();
        this.logService.addLog('Backup automático realizado');
    }
    getTasksByPriority(priority) {
        return this.priorityService.getTasksByPriority(this.taskService.getTasks(), priority);
    }
    getAllPriorities() {
        return this.priorityService.getPriorities();
    }
}
//# sourceMappingURL=UIController.js.map