// ===== TASK RENDERER - All task-related rendering =====

import { TaskService, ExtendedTask } from '../services/TaskService.js';
import { UserService } from '../services/UserService.js';
import { TagManager } from '../utils/TagManager.js';
import { SearchService } from '../services/SearchService.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { CommentService } from '../services/CommentService.js';
import { AttachmentService } from '../services/AttachmentService.js';
import { processTask } from '../utils/TaskUtils.js';

const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const PRIORITY_DISPLAY_MAP: Record<string, string> = { 'LOW': 'Baixa', 'MEDIUM': 'Média', 'HIGH': 'Alta', 'CRITICAL': 'Crítica' };

export class RenderTask {
  private activeTaskModalId: number | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private tagService: TagManager<any>,
    private searchService: SearchService,
    private commentService: CommentService,
    private attachmentService: AttachmentService
  ) {}

  render(): void {
    // Get filter criteria from UI inputs
    const searchCriteria = {
      text: (document.getElementById('searchTask') as HTMLInputElement)?.value || '',
      status: (document.getElementById('filterStatus') as HTMLSelectElement)?.value || '',
      priority: (document.getElementById('filterPriority') as HTMLSelectElement)?.value || '',
      type: (document.getElementById('filterType') as HTMLSelectElement)?.value || '',
      tag: (document.getElementById('filterTag') as HTMLInputElement)?.value || '',
    };

    let filteredTasks = this.searchService.narrowSearch(
      this.taskService.getTasks(),
      searchCriteria,
      this.tagService
    );

    // Apply favorites filter if selected
    const favoritesFilter = (document.getElementById('filterFavoriteTasks') as HTMLButtonElement)?.classList.contains('bg-yellow-200');
    if (favoritesFilter) {
      filteredTasks = filteredTasks.filter((t: ExtendedTask) => window.favoriteTasks.exists(t));
    }

    // Apply sorting based on sort state
    const sortState = window.appContext.taskSortState || 'none';
    if (sortState === 'asc') {
      filteredTasks = filteredTasks.sort((a: ExtendedTask, b: ExtendedTask) => 
        a.title.localeCompare(b.title)
      );
    } else if (sortState === 'desc') {
      filteredTasks = filteredTasks.sort((a: ExtendedTask, b: ExtendedTask) => 
        b.title.localeCompare(a.title)
      );
    }

    // Use pagination to render tasks
    window.renderTasksWithPagination(filteredTasks);
  }

  public renderTaskRow(t: ExtendedTask): string {
    // Apply color styling based on task status
    const statusColor =
      t.status === TaskStatus.COMPLETED
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
        : t.status === TaskStatus.IN_PROGRESS
          ? 'bg-amber-50 text-amber-600 border-amber-100'
          : 'bg-blue-50 text-blue-600 border-blue-100';

    let priorityColorClass = 'text-slate-400';
    // Set priority colors: medium (amber), high (orange), critical (red)
    if (t.priority === 'MEDIUM') priorityColorClass = 'text-amber-500 font-bold';
    if (t.priority === 'HIGH') priorityColorClass = 'text-orange-500 font-bold';
    if (t.priority === 'CRITICAL') priorityColorClass = 'text-red-600 font-bold';

    // Map task type and priority to Portuguese display text
    const typeMap: Record<string, string> = { 'bug': 'Erro', 'feature': 'Funcionalidade', 'task': 'Tarefa' };
    const priorityMap: Record<string, string> = { 'LOW': 'Baixa', 'MEDIUM': 'Média', 'HIGH': 'Alta', 'CRITICAL': 'Crítica' };
    const displayType = typeMap[t.type?.toLowerCase()] || t.type;
    const displayPriority = priorityMap[t.priority || 'LOW'] || (t.priority || 'Baixa');

    const isFavorite = window.favoriteTasks.exists(t);
    const favoriteStarClass = isFavorite ? 'favorite-star active' : 'favorite-star inactive';
    
    const currentUser = window.appContext.userService.getUserById(window.appContext.currentUserId);
    const watchers = window.watcherSystem.getWatchers(t);
    const isWatching = currentUser && watchers.includes(currentUser);
    const watchClass = isWatching ? 'text-blue-600 font-bold' : 'text-slate-400';
    const watchCount = watchers.length;

    return `
      <tr class="group hover:bg-slate-50 transition-colors border-b border-slate-100" data-task-id="${t.id}">
        <td class="py-4 px-2 flex items-center gap-2">
          <div class="flex flex-col gap-1 items-center">
            <span class="${favoriteStarClass}" onclick="event.stopPropagation(); window.appContext.renderTask.toggleTaskFavorite(${t.id})">★</span>
            <button class="${watchClass} cursor-pointer p-1.5 rounded-md" onclick="event.stopPropagation(); window.appContext.renderTask.toggleTaskWatch(${t.id})" data-watch-btn style="display: flex; align-items: center; justify-content: center;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7C7.523 19 3.732 16.057 2.458 12z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <span class=\"text-xs text-slate-400\" data-watch-count>${watchCount}</span>
          </div>
          <div class="flex-1">
            <p class="font-bold text-slate-700 ${t.status === TaskStatus.COMPLETED ? 'line-through opacity-40' : ''}">\u200b${t.title}</p>
            <span class="text-[8px] ${priorityColorClass} block uppercase tracking-tighter mt-1">${displayType} | ${displayPriority} ${t.deadline ? '| Expira: ' + t.deadline : ''}</span>
          </div>
        </td>
        <td class="py-4 text-center align-middle">
          <button onclick="event.stopPropagation(); window.appContext.renderTask.cycleTaskStatus(${t.id})" ${((window.appContext.currentUserRole === 'VIEWER')) ? 'disabled' : ''} class="text-[9px] font-bold px-3 py-1.5 rounded-md border min-w-[100px] inline-block ${statusColor} ${((window.appContext.currentUserRole === 'VIEWER')) ? 'opacity-50 cursor-not-allowed' : ''}">${t.status.toUpperCase()}</button>
        </td>
        <td class="py-4 text-right pr-2">
          <div class="flex flex-col gap-1 items-center">
            <button ${((window.appContext.checkPermission?.('edit_title'))) ? '' : 'disabled'} onclick="event.stopPropagation(); ${((window.appContext.checkPermission?.('edit_title'))) ? `window.appContext.renderTask.openTaskModal(${t.id})` : 'return false'}" class="text-slate-300 hover:text-indigo-600 transition-colors ${!((window.appContext.checkPermission?.('edit_title'))) ? 'opacity-50 cursor-not-allowed' : ''}" title="Editar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            ${((window.appContext.checkPermission?.('delete_task'))) ? `
            <button onclick="event.stopPropagation(); window.appContext.renderTask.deleteTask(${t.id})" class="text-slate-300 hover:text-red-500 transition-colors" title="Remover">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>` : ''}
          </div>
        </td>
      </tr>`;
  }

  // ===== TASK MODAL =====
  // Opens detailed task modal with tags, comments, and attachments
  openTaskModal(taskId: number): void {
    this.activeTaskModalId = taskId;
    const task = this.taskService.getTaskById(taskId);
    if (!task) return;

    // Map type and priority to Portuguese
    const typeMap: Record<string, string> = { 'bug': 'Erro', 'feature': 'Funcionalidade', 'task': 'Tarefa' };
    const priorityMap: Record<string, string> = { 'LOW': 'Baixa', 'MEDIUM': 'Média', 'HIGH': 'Alta', 'CRITICAL': 'Crítica' };
    const displayType = typeMap[task.type?.toLowerCase()] || task.type;
    const displayPriority = priorityMap[task.priority || 'LOW'] || (task.priority || 'Baixa');

    const isViewer = window.appContext.currentUserRole === 'VIEWER';
    const modalHtml = `
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
        <h3 class="font-bold mb-2">${task.title}</h3>
        <p class="text-[10px] text-slate-400 mb-4">Tipo: ${displayType} | Prioridade: ${displayPriority}</p>
        
        ${!isViewer ? `
        <div class="mb-4 space-y-2">
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">NOME DA TAREFA:</label>
            <input id="taskTitleInput" type="text" value="${task.title}" class="w-full text-[10px] px-2 py-1.5 rounded-md border bg-white" onkeypress="if(event.key==='Enter'){ window.appContext.renderTask.saveTaskTitle(${taskId}); }">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">ATRIBUIR A:</label>
            <select id="taskAssignSelect" onchange="window.appContext.renderTask.manualAssign(${taskId}, this.value)" class="w-full text-[10px] px-2 py-1.5 rounded-md border bg-white">
              <option value="">Sem atribuição</option>
              ${this.userService
                .getActiveUsers()
                .map(u => `<option value="${u.email}" ${task.assigned?.includes(u.email) ? 'selected' : ''}>${u.name}</option>`)
                .join('')}
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">PRIORIDADE:</label>
            <select id="taskPrioritySelect" onchange="window.appContext.renderTask.setTaskPriority(${taskId}, this.value)" class="w-full text-[10px] px-2 py-1.5 rounded-md border bg-white">
              ${TASK_PRIORITIES.map(p => `<option value="${p}" ${task.priority === p ? 'selected' : ''}>${PRIORITY_DISPLAY_MAP[p] || p}</option>`).join('')}
            </select>
          </div>
        </div>
        ` : ''}
        
        ${!isViewer ? `
        <div class="mb-4">
          <h4 class="font-bold text-xs mb-1">Etiquetas:</h4>
          <div id="taskTagsList" class="flex flex-wrap gap-1 mb-2"></div>
          <input type="text" id="tagInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Nova etiqueta..." onkeypress="if(event.key==='Enter'){ window.appContext.renderTask.addTag(); }">
        </div>
        ` : '<div class="mb-4"><h4 class="font-bold text-xs mb-1">Etiquetas:</h4><div id="taskTagsList" class="flex flex-wrap gap-1 mb-2"></div></div>'}
        <div id="taskComments" class="max-h-32 overflow-y-auto mb-2 border-t pt-2"></div>
        ${!isViewer ? `<input type="text" id="newCommentInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Comentário..." onkeypress="if(event.key==='Enter'){ window.appContext.renderTask.addComment(); }">` : '<p class="text-[10px] text-slate-400 italic">Visualizador - Sem permissão para comentar</p>'}
        ${!isViewer ? `
        <div class="mt-4">
          <h4 class="font-bold text-xs mb-1">Anexos:</h4>
          <div id="taskAttachments" class="max-h-24 overflow-y-auto"></div>
          <input type="file" id="newAttachmentInput" class="mt-1 text-xs" onchange="window.appContext.renderTask.addAttachment(event)">
        </div>
        ` : '<div class="mt-4"><h4 class="font-bold text-xs mb-1">Anexos:</h4><div id="taskAttachments" class="max-h-24 overflow-y-auto"></div></div>'}
        <div class="flex justify-end gap-2 mt-4">
          <button onclick="window.appContext.renderTask.closeTaskModal()" class="px-4 py-2 bg-gray-200 rounded text-xs">Cancelar</button>
          ${!isViewer ? `<button onclick="window.appContext.renderTask.saveAllTaskChanges(${taskId})" class="px-4 py-2 bg-indigo-600 text-white rounded text-xs">Guardar</button>` : ''}
        </div>
      </div>`;

    const container = document.createElement('div');
    container.id = 'taskModalContainer';
    container.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50';
    container.innerHTML = modalHtml;
    document.body.appendChild(container);
    this.renderTaskModalContent();
  }

  // Closes task modal and resets active task ID
  closeTaskModal(): void {
    const modal = document.getElementById('taskModalContainer');
    if (modal) modal.remove();
    this.activeTaskModalId = null;
  }

  // Renders tags, comments, and attachments inside the task modal
  private renderTaskModalContent(): void {
    if (!this.activeTaskModalId) return;

    const tagsList = document.getElementById('taskTagsList');
    if (tagsList) {
      tagsList.innerHTML = this.tagService
        .getTags(this.activeTaskModalId)
        .map(
          tag =>
            `<span class="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center">#${tag} <button onclick="window.appContext.renderTask.removeTag('${tag}')" class="ml-1 text-red-400">×</button></span>`
        )
        .join('');
    }

    const commentsContainer = document.getElementById('taskComments');
    if (commentsContainer) {
      commentsContainer.innerHTML = this.commentService
        .getComments(this.activeTaskModalId)
        .map(
          c => {
            const user = this.userService.getUserById(c.userId);
            const userEmail = user?.email || `User ${c.userId}`;
            return `<div class="flex justify-between text-[10px] mb-1"><span><b>${userEmail}:</b> ${c.message}</span><button onclick="window.appContext.renderTask.deleteComment(${c.id})" class="text-red-500">×</button></div>`;
          }
        )
        .join('');
    }

    const attachmentsContainer = document.getElementById('taskAttachments');
    if (attachmentsContainer) {
      attachmentsContainer.innerHTML = this.attachmentService
        .getAttachments(this.activeTaskModalId)
        .map(
          a =>
            `<div class="flex justify-between text-[10px] mb-1"><a href="${a.url}" download="${a.filename}" class="text-blue-600 underline">${a.filename}</a><button onclick="window.appContext.renderTask.deleteAttachment(${a.id})" class="text-red-500">×</button></div>`
        )
        .join('');
    }
  }

  // ===== TAG MANAGEMENT =====
  // Adds a new tag to the active task
  addTag(): void {
    if (!this.activeTaskModalId) return;
    const input = document.getElementById('tagInput') as HTMLInputElement;
    this.tagService.addTag(this.activeTaskModalId, input.value);
    input.value = '';
    this.renderTaskModalContent();
  }

  // Removes a tag from the active task
  removeTag(tag: string): void {
    if (!this.activeTaskModalId) return;
    this.tagService.removeTag(this.activeTaskModalId, tag);
    this.renderTaskModalContent();
  }

  // ===== COMMENT MANAGEMENT =====
  // Adds a comment to the task (permission-based)
  addComment(): void {
    // VIEWER role cannot add comments
    if (window.appContext.currentUserRole === 'VIEWER') {
      window.appContext.notificationService.addNotification('Sem permissão para comentar!', 'warning');
      return;
    }

    if (!this.activeTaskModalId) return;
    const input = document.getElementById('newCommentInput') as HTMLInputElement;
    if (!input.value.trim()) return;

    // Get the task and its assigned user
    const task = this.taskService.getTaskById(this.activeTaskModalId);
    let userId = 0; // Default to admin
    
    if (task?.assigned && task.assigned.length > 0) {
      // Find the user ID from the assigned email
      const assignedEmail = task.assigned[0];
      const assignedUser = this.userService.getUserByEmail(assignedEmail);
      if (assignedUser) userId = assignedUser.id;
    }
    
    this.commentService.addComment(this.activeTaskModalId, userId, input.value);
    window.appContext.notificationService.addNotification('Comentário adicionado!', 'success');
    input.value = '';
    this.renderTaskModalContent();
  }

  // Deletes a comment and refreshes modal content
  deleteComment(id: number): void {
    this.commentService.deleteComment(id);
    this.renderTaskModalContent();
  }

  // ===== ATTACHMENT MANAGEMENT =====
  // Reads file as base64 and adds it as task attachment
  addAttachment(event: Event): void {
    if (!this.activeTaskModalId) return;
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.attachmentService.addAttachment(this.activeTaskModalId!, {
        taskId: this.activeTaskModalId!,
        filename: file.name,
        size: file.size,
        url: e.target?.result as string,
      });
      window.appContext.notificationService.addNotification(`Ficheiro "${file.name}" anexado!`, 'success');
      this.renderTaskModalContent();
    };
    reader.readAsDataURL(file);
  }

  // Removes an attachment from the task
  deleteAttachment(id: number): void {
    this.attachmentService.removeAttachment(id);
    window.appContext.notificationService.addNotification('Ficheiro removido!', 'success');
    this.renderTaskModalContent();
  }

  // ===== TASK ACTIONS =====
  // Cycles task through PENDING -> IN_PROGRESS -> COMPLETED
  cycleTaskStatus(id: number): void {
    // VIEWER cannot change task status
    if (window.appContext.currentUserRole === 'VIEWER') {
      window.appContext.notificationService.addNotification('Sem permissão para alterar o estado!', 'warning');
      return;
    }

    const TASK_STATUS_CYCLE = [TaskStatus.CREATED, TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED, TaskStatus.COMPLETED, TaskStatus.ARCHIVED];
    const task = this.taskService.getTaskById(id);
    if (!task) return;

    const currentIndex = TASK_STATUS_CYCLE.indexOf(task.status as TaskStatus);
    const newStatus = TASK_STATUS_CYCLE[(currentIndex + 1) % TASK_STATUS_CYCLE.length];
    this.taskService.updateTaskStatus(id, newStatus);
    window.appContext.logService.addLog(`Status "${task.title}": ${task.status} -> ${newStatus}`);
    window.appContext.notificationService.addNotification(`Status alterado: ${task.status} → ${newStatus}`, 'success');
    
    // Process task with type-specific logic (BugTask, Feature, etc)
    if (task.type && ['Bug', 'Feature', 'Task'].includes(task.type)) {
      const taskObj = {
        id: task.id,
        title: task.title,
        completed: task.status === TaskStatus.COMPLETED,
        status: task.status as TaskStatus,
        getType: () => task.type?.toLowerCase() || 'task',
        moveTo: (newStatus: TaskStatus) => { task.status = newStatus; }
      };
      processTask(taskObj);
    }
    
    window.appContext.automationService.applyRules(task);
    window.appContext.saveAndRender();
  }

  // Opens confirmation modal to delete task
  deleteTask(id: number): void {
    const task = this.taskService.getTaskById(id);
    if (!task) return;
    window.appContext.renderModals.openConfirmModal(`Eliminar tarefa?`, () => {
      this.taskService.deleteTask(id);
      window.appContext.notificationService.addNotification(`Tarefa "${task.title}" eliminada!`, 'success');
      window.appContext.saveAndRender();
    });
  }

  // Assigns task to a user via email
  manualAssign(taskId: number, email: string): void {
    const task = this.taskService.getTaskById(taskId);
    if (!task) return;
    task.assigned = email ? [email] : [];
    if (email) {
      window.appContext.logService.addLog(`Tarefa "${task.title}" atribuída a ${email}`);
      window.appContext.notificationService.addNotification(`Tarefa "${task.title}" atribuída a ${email}!`, 'success');
    }
    window.appContext.saveAndRender();
  }

  // Updates task priority and logs the change
  setTaskPriority(taskId: number, p: string): void {
    const task = this.taskService.getTaskById(taskId);
    if (!task) return;
    this.taskService.updateTaskPriority(taskId, p);
    window.appContext.priorityService.setPriority(taskId, p as any);
    window.appContext.logService.addLog(`Tarefa "${task.title}" prioridade -> ${p}`);
    window.appContext.notificationService.addNotification(`Prioridade alterada: ${p.toUpperCase()}`, 'success');
    window.appContext.saveAndRender();
  }

  // Saves updated task title from modal
  saveTaskTitle(taskId: number): void {
    const input = document.getElementById('taskTitleInput') as HTMLInputElement;
    if (!input) return;

    const newTitle = input.value.trim();
    if (!newTitle) return;

    const task = this.taskService.getTaskById(taskId);
    if (!task) return;

    const oldTitle = task.title;
    this.taskService.updateTaskTitle(taskId, newTitle);
    window.appContext.logService.addLog(`Tarefa renomeada: "${oldTitle}" -> "${newTitle}"`);
    window.appContext.notificationService.addNotification(`Tarefa renomeada: "${newTitle}"`, 'success');
    
    window.appContext.saveAndRender();
  }

  // Opens modal to edit task title
  editTaskTitle(taskId: number): void {
    window.appContext.renderModals.openEditTitleModal(taskId);
  }

  // Saves all changes made in the task modal (title, priority, assignment)
  saveAllTaskChanges(taskId: number): void {
    const titleInput = document.getElementById('taskTitleInput') as HTMLInputElement;
    const prioritySelect = document.getElementById('taskPrioritySelect') as HTMLSelectElement;
    const assignSelect = document.getElementById('taskAssignSelect') as HTMLSelectElement;

    const task = this.taskService.getTaskById(taskId);
    if (!task) return;

    let changed = false;

    // Save title if changed
    if (titleInput && titleInput.value.trim() !== task.title) {
      const newTitle = titleInput.value.trim();
      if (newTitle) {
        const oldTitle = task.title;
        this.taskService.updateTaskTitle(taskId, newTitle);
        window.appContext.logService.addLog(`Tarefa renomeada: "${oldTitle}" -> "${newTitle}"`);
        changed = true;
      }
    }

    // Save priority if changed
    if (prioritySelect && prioritySelect.value !== task.priority) {
      this.taskService.updateTaskPriority(taskId, prioritySelect.value);
      window.appContext.priorityService.setPriority(taskId, prioritySelect.value as any);
      window.appContext.logService.addLog(`Tarefa "${task.title}" prioridade -> ${prioritySelect.value}`);
      changed = true;
    }

    // Save assignment if changed
    if (assignSelect && assignSelect.value) {
      const newEmail = assignSelect.value;
      if (!task.assigned?.includes(newEmail)) {
        task.assigned = [newEmail];
        window.appContext.logService.addLog(`Tarefa "${task.title}" atribuída a ${newEmail}`);
        changed = true;
      }
    } else if (assignSelect && !assignSelect.value && task.assigned?.length) {
      task.assigned = [];
      window.appContext.logService.addLog(`Tarefa "${task.title}" desatribuída`);
      changed = true;
    }

    if (changed) {
      window.appContext.notificationService.addNotification('Alterações guardadas com sucesso!', 'success');
      window.appContext.saveAndRender();
    } else {
      window.appContext.notificationService.addNotification('Nenhuma alteração feita.', 'info');
    }

    this.closeTaskModal();
  }

  // Toggles task favorite status
  toggleTaskFavorite(taskId: number): void {
    const task = this.taskService.getTaskById(taskId);
    if (!task) return;
    
    if (window.favoriteTasks.exists(task)) {
      window.favoriteTasks.remove(task);
      window.appContext.notificationService.addNotification(`"${task.title}" removida de favoritos!`, 'info');
      window.appContext.logService.addLog(`Tarefa "${task.title}" removida de favoritos`);
    } else {
      window.favoriteTasks.add(task);
      window.appContext.notificationService.addNotification(`"${task.title}" adicionada aos favoritos!`, 'success');
      window.appContext.logService.addLog(`Tarefa "${task.title}" adicionada aos favoritos`);
    }
    
    window.appContext.saveAndRender();
  }

  // Toggles task watch status
  toggleTaskWatch(taskId: number): void {
    const task = this.taskService.getTaskById(taskId);
    if (!task) return;
    
    const currentUser = window.appContext.userService.getUserById(window.appContext.currentUserId);
    if (!currentUser) return;
    
    const watchers = window.watcherSystem.getWatchers(task);
    
    if (watchers.includes(currentUser)) {
      window.watcherSystem.unwatch(task, currentUser);
      window.appContext.notificationService.addNotification(`Deixou de seguir "${task.title}"!`, 'info');
      window.appContext.logService.addLog(`Deixou de seguir a tarefa "${task.title}"`);
    } else {
      window.watcherSystem.watch(task, currentUser);
      window.appContext.notificationService.addNotification(`Agora está a seguir "${task.title}"!`, 'success');
      window.appContext.logService.addLog(`Agora está a seguir a tarefa "${task.title}"`);
    }
    
    // Only save data, don't re-render
    window.appContext.saveData();
    
    // Update DOM locally only
    const taskRow = document.querySelector(`tr[data-task-id="${taskId}"]`);
    if (taskRow) {
      const watchButton = taskRow.querySelector('button[data-watch-btn]');
      const watchCounter = taskRow.querySelector('[data-watch-count]');
      
      if (watchButton && watchCounter) {
        const updatedWatchers = window.watcherSystem.getWatchers(task);
        const isWatching = updatedWatchers.includes(currentUser);
        
        // Update counter
        watchCounter.textContent = updatedWatchers.length.toString();
        
        // Update button styling
        const newWatchClass = isWatching ? 'text-blue-600 font-bold' : 'text-slate-400';
        watchButton.className = `${newWatchClass} cursor-pointer p-1.5 rounded-md`;
      }
    }
  }
}
