// ===== TASK RENDERER - All task-related rendering =====
import { TaskStatus } from '../tasks/TaskStatus.js';
import { processTask } from '../utils/TaskUtils.js';
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
export class RenderTask {
    taskService;
    userService;
    tagService;
    searchService;
    commentService;
    attachmentService;
    activeTaskModalId = null;
    constructor(taskService, userService, tagService, searchService, commentService, attachmentService) {
        this.taskService = taskService;
        this.userService = userService;
        this.tagService = tagService;
        this.searchService = searchService;
        this.commentService = commentService;
        this.attachmentService = attachmentService;
    }
    render() {
        const searchCriteria = {
            text: document.getElementById('searchTask')?.value || '',
            status: document.getElementById('filterStatus')?.value || '',
            priority: document.getElementById('filterPriority')?.value || '',
            type: document.getElementById('filterType')?.value || '',
            tag: document.getElementById('filterTag')?.value || '',
        };
        const filteredTasks = this.searchService.filterTasks(this.taskService.getTasks(), searchCriteria, this.tagService);
        const taskList = document.getElementById('taskList');
        if (!taskList)
            return;
        taskList.innerHTML = filteredTasks
            .map((t) => this.renderTaskRow(t))
            .join('');
    }
    renderTaskRow(t) {
        const statusColor = t.status === TaskStatus.COMPLETED
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : t.status === TaskStatus.IN_PROGRESS
                ? 'bg-amber-50 text-amber-600 border-amber-100'
                : 'bg-blue-50 text-blue-600 border-blue-100';
        let priorityColorClass = 'text-slate-400';
        if (t.priority === 'MEDIUM')
            priorityColorClass = 'text-amber-500 font-bold';
        if (t.priority === 'HIGH')
            priorityColorClass = 'text-orange-500 font-bold';
        if (t.priority === 'CRITICAL')
            priorityColorClass = 'text-red-600 font-bold';
        return `
      <tr class="group hover:bg-slate-50 transition-colors border-b border-slate-100">
        <td class="py-4 px-2 cursor-pointer" onclick="window.renderTask.openTaskModal(${t.id})">
          <p class="font-bold text-slate-700 ${t.status === TaskStatus.COMPLETED ? 'line-through opacity-40' : ''}">${t.title}</p>
          <span class="text-[8px] ${priorityColorClass} block uppercase tracking-tighter mt-1">${t.type} | ${t.priority || 'LOW'} ${t.deadline ? '| Expira: ' + t.deadline : ''}</span>
        </td>
        <td class="py-4 text-center align-middle">
          <button onclick="event.stopPropagation(); window.renderTask.cycleTaskStatus(${t.id})" class="text-[9px] font-bold px-3 py-1.5 rounded-md border min-w-[100px] inline-block ${statusColor}">${t.status.toUpperCase()}</button>
        </td>
        <td class="py-4 text-right pr-2">
          <div class="flex flex-row items-center justify-end gap-1 h-full">
            ${(window.checkPermission?.('assign_task')) ? `
            <select onchange="event.stopPropagation(); window.renderTask.manualAssign(${t.id}, this.value)" class="text-[10px] h-6 px-2 rounded-md border bg-white min-w-[100px]">
              <option value="">Atribuir...</option>
              ${this.userService
            .getActiveUsers()
            .map(u => `<option value="${u.email}" ${t.assigned?.includes(u.email) ? 'selected' : ''}>${u.email.split('@')[0]}</option>`)
            .join('')}
            </select>` : ''}
            <select onchange="event.stopPropagation(); window.renderTask.setTaskPriority(${t.id}, this.value)" class="text-[10px] h-6 px-2 rounded-md border bg-white min-w-[70px]" ${!(window.checkPermission?.('edit_task')) ? 'disabled' : ''}>
              ${TASK_PRIORITIES.map(p => `<option value="${p}" ${t.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
            ${(window.checkPermission?.('edit_title')) ? `
            <button onclick="event.stopPropagation(); window.renderTask.editTaskTitle(${t.id})" class="text-slate-300 hover:text-indigo-600 p-1.5 rounded-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>` : ''}
            ${(window.checkPermission?.('delete_task')) ? `
            <button onclick="event.stopPropagation(); window.renderTask.deleteTask(${t.id})" class="text-slate-300 hover:text-red-500 p-1.5 rounded-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>` : ''}
          </div>
        </td>
      </tr>`;
    }
    // ===== TASK MODAL =====
    openTaskModal(taskId) {
        this.activeTaskModalId = taskId;
        const task = this.taskService.getTaskById(taskId);
        if (!task)
            return;
        const modalHtml = `
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
        <h3 class="font-bold mb-2">${task.title}</h3>
        <p class="text-[10px] text-slate-400 mb-4">Tipo: ${task.type} | Prioridade: ${task.priority || 'LOW'}</p>
        <div class="mb-4">
          <h4 class="font-bold text-xs mb-1">Tags:</h4>
          <div id="taskTagsList" class="flex flex-wrap gap-1 mb-2"></div>
          <input type="text" id="tagInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Nova tag..." onkeypress="if(event.key==='Enter'){ window.renderTask.addTag(); }">
        </div>
        <div id="taskComments" class="max-h-32 overflow-y-auto mb-2 border-t pt-2"></div>
        <input type="text" id="newCommentInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Comentar..." onkeypress="if(event.key==='Enter'){ window.renderTask.addComment(); }">
        <div class="mt-4">
          <h4 class="font-bold text-xs mb-1">Anexos:</h4>
          <div id="taskAttachments" class="max-h-24 overflow-y-auto"></div>
          <input type="file" id="newAttachmentInput" class="mt-1 text-xs" onchange="window.renderTask.addAttachment(event)">
        </div>
        <div class="flex justify-end mt-4"><button onclick="window.renderTask.closeTaskModal()" class="px-4 py-2 bg-gray-200 rounded text-xs">Fechar</button></div>
      </div>`;
        const container = document.createElement('div');
        container.id = 'taskModalContainer';
        container.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50';
        container.innerHTML = modalHtml;
        document.body.appendChild(container);
        this.renderTaskModalContent();
    }
    closeTaskModal() {
        const modal = document.getElementById('taskModalContainer');
        if (modal)
            modal.remove();
        this.activeTaskModalId = null;
    }
    renderTaskModalContent() {
        if (!this.activeTaskModalId)
            return;
        const tagsList = document.getElementById('taskTagsList');
        if (tagsList) {
            tagsList.innerHTML = this.tagService
                .getTags(this.activeTaskModalId)
                .map(tag => `<span class="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center">#${tag} <button onclick="window.renderTask.removeTag('${tag}')" class="ml-1 text-red-400">×</button></span>`)
                .join('');
        }
        const commentsContainer = document.getElementById('taskComments');
        if (commentsContainer) {
            commentsContainer.innerHTML = this.commentService
                .getComments(this.activeTaskModalId)
                .map(c => {
                const user = this.userService.getUserById(c.userId);
                const userEmail = user?.email || `User ${c.userId}`;
                return `<div class="flex justify-between text-[10px] mb-1"><span><b>${userEmail}:</b> ${c.message}</span><button onclick="window.renderTask.deleteComment(${c.id})" class="text-red-500">×</button></div>`;
            })
                .join('');
        }
        const attachmentsContainer = document.getElementById('taskAttachments');
        if (attachmentsContainer) {
            attachmentsContainer.innerHTML = this.attachmentService
                .getAttachments(this.activeTaskModalId)
                .map(a => `<div class="flex justify-between text-[10px] mb-1"><a href="${a.url}" download="${a.filename}" class="text-blue-600 underline">${a.filename}</a><button onclick="window.renderTask.deleteAttachment(${a.id})" class="text-red-500">×</button></div>`)
                .join('');
        }
    }
    // ===== TAG MANAGEMENT =====
    addTag() {
        if (!this.activeTaskModalId)
            return;
        const input = document.getElementById('tagInput');
        this.tagService.addTag(this.activeTaskModalId, input.value);
        input.value = '';
        this.renderTaskModalContent();
    }
    removeTag(tag) {
        if (!this.activeTaskModalId)
            return;
        this.tagService.removeTag(this.activeTaskModalId, tag);
        this.renderTaskModalContent();
    }
    // ===== COMMENT MANAGEMENT =====
    addComment() {
        if (!this.activeTaskModalId)
            return;
        const input = document.getElementById('newCommentInput');
        if (!input.value.trim())
            return;
        // Get the task and its assigned user
        const task = this.taskService.getTaskById(this.activeTaskModalId);
        let userId = 0; // Default to admin
        if (task?.assigned && task.assigned.length > 0) {
            // Find the user ID from the assigned email
            const assignedEmail = task.assigned[0];
            const assignedUser = this.userService.getUserByEmail(assignedEmail);
            if (assignedUser)
                userId = assignedUser.id;
        }
        this.commentService.addComment(this.activeTaskModalId, userId, input.value);
        input.value = '';
        this.renderTaskModalContent();
    }
    deleteComment(id) {
        this.commentService.deleteComment(id);
        this.renderTaskModalContent();
    }
    // ===== ATTACHMENT MANAGEMENT =====
    addAttachment(event) {
        if (!this.activeTaskModalId)
            return;
        const target = event.target;
        const file = target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.attachmentService.addAttachment(this.activeTaskModalId, {
                taskId: this.activeTaskModalId,
                filename: file.name,
                size: file.size,
                url: e.target?.result,
            });
            this.renderTaskModalContent();
        };
        reader.readAsDataURL(file);
    }
    deleteAttachment(id) {
        this.attachmentService.removeAttachment(id);
        this.renderTaskModalContent();
    }
    // ===== TASK ACTIONS =====
    cycleTaskStatus(id) {
        const TASK_STATUS_CYCLE = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED];
        const task = this.taskService.getTaskById(id);
        if (!task)
            return;
        const currentIndex = TASK_STATUS_CYCLE.indexOf(task.status);
        const newStatus = TASK_STATUS_CYCLE[(currentIndex + 1) % TASK_STATUS_CYCLE.length];
        this.taskService.updateTaskStatus(id, newStatus);
        window.services.logService.addLog(`Status "${task.title}": ${task.status} -> ${newStatus}`);
        // Process task with type-specific logic (BugTask, Feature, etc)
        if (task.type && ['Bug', 'Feature', 'Task'].includes(task.type)) {
            const taskObj = {
                id: task.id,
                title: task.title,
                completed: task.status === TaskStatus.COMPLETED,
                status: task.status,
                getType: () => task.type?.toLowerCase() || 'task',
                moveTo: (newStatus) => { task.status = newStatus; }
            };
            processTask(taskObj);
        }
        window.services.automationService.applyRules(task);
        window.saveAndRender();
    }
    deleteTask(id) {
        const task = this.taskService.getTaskById(id);
        if (!task)
            return;
        window.renderModals.openConfirmModal(`Remover tarefa?`, () => {
            this.taskService.deleteTask(id);
            window.saveAndRender();
        });
    }
    manualAssign(taskId, email) {
        const task = this.taskService.getTaskById(taskId);
        if (!task)
            return;
        task.assigned = email ? [email] : [];
        if (email)
            window.services.logService.addLog(`Tarefa "${task.title}" atribuída a ${email}`);
        window.saveAndRender();
    }
    setTaskPriority(taskId, p) {
        const task = this.taskService.getTaskById(taskId);
        if (!task)
            return;
        this.taskService.updateTaskPriority(taskId, p);
        window.services.logService.addLog(`Tarefa "${task.title}" prioridade -> ${p}`);
        window.saveAndRender();
    }
    editTaskTitle(taskId) {
        window.renderModals.openEditTitleModal(taskId);
    }
}
//# sourceMappingURL=renderTask.js.map