// ===== MODAL RENDERER - Generic modal rendering (confirmation, edit, etc) =====

import { TaskService, ExtendedTask } from '../services/TaskService.js';
import { UserService } from '../services/UserService.js';
import { SystemLogger } from '../logs/SystemLogger.js';
import { SystemConfig } from '../services/SystemConfig.js';
import { BaseEntity } from '../models/BaseEntity.js';
import { IdGenerator } from '../utils/IdGenerator.js';

export class RenderModals {
  private pendingDeleteAction: (() => void) | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  // ===== CONFIRMATION MODAL =====
  // Opens confirmation dialog with custom message and callback
  openConfirmModal(message: string, confirmCallback: () => void): void {
    const msgEl = document.getElementById('modalMessage');
    const modalEl = document.getElementById('confirmModal');
    if (msgEl) msgEl.innerText = message;
    if (modalEl) modalEl.classList.remove('hidden');
    this.pendingDeleteAction = confirmCallback;
  }

  // Hides confirmation modal
  closeConfirmModal(): void {
    const modalEl = document.getElementById('confirmModal');
    if (modalEl) modalEl.classList.add('hidden');
  }

  // Executes pending action and closes modal
  confirmAction(): void {
    if (this.pendingDeleteAction) this.pendingDeleteAction();
    this.closeConfirmModal();
  }

  // ===== EDIT TITLE MODAL =====
  // Opens modal to edit task title with auto-focus on input
  openEditTitleModal(taskId: number): void {
    const task = this.taskService.getTaskById(taskId);
    if (!task) return;

    if (document.getElementById('editTitleModal')) return;

    const modal = document.createElement('div');
    modal.id = 'editTitleModal';
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 class="font-bold text-lg mb-3">Editar nome da tarefa</h3>
        <input id="editTitleInput" class="w-full border rounded px-3 py-2 mb-4 text-sm" value="${task.title}">
        <div class="flex justify-end gap-2">
          <button onclick="window.renderModals.closeEditTitleModal()" class="px-4 py-2 bg-gray-200 rounded text-sm">Cancelar</button>
          <button onclick="window.renderModals.saveEditTitle(${taskId})" class="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
      (document.getElementById('editTitleInput') as HTMLInputElement)?.focus();
    }, 50);
  }

  // Removes edit title modal from DOM
  closeEditTitleModal(): void {
    const modal = document.getElementById('editTitleModal');
    if (modal) modal.remove();
  }

  // Saves updated task title and logs the change
  saveEditTitle(taskId: number): void {
    const input = document.getElementById('editTitleInput') as HTMLInputElement;
    if (!input) return;

    const newTitle = input.value.trim();
    if (!newTitle) return;

    const task = this.taskService.getTaskById(taskId);
    if (!task) return;

    const oldTitle = task.title;
    this.taskService.updateTaskTitle(taskId, newTitle);
    SystemLogger.log(`Tarefa renomeada: "${oldTitle}" -> "${newTitle}"`);
    
    this.closeEditTitleModal();
    window.appContext.saveAndRender();
  }

  // ===== GENERIC MODAL =====
  // Opens a generic modal with custom title and content
  openModal(title: string, content: string): void {
    const modalId = 'genericModal';
    
    // Close any existing generic modal
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 class="font-bold text-lg mb-4">${title}</h3>
        <div class="mb-4">
          ${content}
        </div>
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 bg-gray-200 rounded text-sm" id="closeGenericModalBtn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Attach click listener to close button
    const closeBtn = document.getElementById('closeGenericModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
  }

  // Removes generic modal from DOM
  closeModal(): void {
    const modal = document.getElementById('genericModal');
    if (modal) modal.remove();
  }

  // ===== EDIT USER MODAL =====
  // Opens modal to edit user details (name, email, role, photo)
  openEditUserModal(userId: number, user: any): void {
    const modalId = 'editUserModal';
    
    // Close any existing edit user modal
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    // Get ratings for the user
    const average = window.ratingSystem.getAverage(user);
    const ratings = window.ratingSystem.getRatings(user);
    const ratingStarsHTML = [1, 2, 3, 4, 5]
      .map(i => {
        const isFilled = i <= Math.round(average);
        return `<span class="text-xl ${isFilled ? 'text-amber-400' : 'text-amber-200'}">${isFilled ? '★' : '☆'}</span>`;
      })
      .join('');
    const ratingsInfoHTML = ratings.length === 0 
      ? '<p class="text-slate-500 text-xs">Nenhuma avaliação ainda</p>'
      : `<p class="text-xs"><b>Média:</b> ${average.toFixed(1)} (${ratings.length} avaliações)</p>`;
    
    // Get watchers for the user
    const watchers = window.watcherSystem.getWatchers(user);
    const watchersListHTML = watchers.length > 0 
      ? watchers.map((w: any) => `<li class="text-xs text-slate-700">• ${w.name}</li>`).join('')
      : '<li class="text-xs text-slate-500 italic">Nenhum seguidor</li>';
    
    // Get assigned tasks
    const assignedTasks = window.appContext.taskService.getTasks().filter((t: any) => t.assigned && Array.isArray(t.assigned) && t.assigned.some((email: any) => String(email) === String(user.email)));
    const tasksListHTML = assignedTasks.length > 0 
      ? assignedTasks.map((t: any) => `<li class="text-xs text-slate-700">• ${t.title} <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${t.status}</span></li>`).join('')
      : '<li class="text-xs text-slate-500 italic">Nenhuma tarefa atribuída</li>';

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-[85vw] p-6 border border-slate-100 max-h-[90vh] overflow-y-auto flex flex-col">
        <h3 class="font-bold text-base mb-4">Editar ${user.name}</h3>
        
        <div class="grid grid-cols-2 gap-6 flex-1">
          <!-- Left Column: Information Display -->
          <div class="space-y-4 bg-slate-50 p-4 rounded-lg overflow-y-auto">
            <div>
              <p class="text-xs font-bold text-slate-600 mb-1">ID</p>
              <p class="text-xs font-semibold text-slate-900">${user.id}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-600 mb-1">E-MAIL ATUAL</p>
              <p class="text-xs font-semibold text-slate-900">${user.email}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-600 mb-1">FUNÇÃO ATUAL</p>
              <p class="text-xs font-semibold text-slate-900">${user.role}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-600 mb-1">ESTADO</p>
              <p class="text-xs font-semibold ${user.active ? 'text-emerald-600' : 'text-slate-400'}">${user.active ? 'ATIVO' : 'INATIVO'}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-600 mb-1">NÍVEL VIP ATUAL</p>
              <p class="text-xs font-semibold text-slate-900">${window.priorityManager.getPriority(user) || 'Sem VIP'}</p>
            </div>
            <div class="pt-2 border-t border-slate-200">
              <p class="text-xs font-bold text-slate-600 mb-2">⭐ AVALIAÇÕES</p>
              <div class="flex gap-0.5 mb-2">
                ${ratingStarsHTML}
              </div>
              ${ratingsInfoHTML}
            </div>
            <div class="pt-2 border-t border-slate-200">
              <p class="text-xs font-bold text-slate-600 mb-2">👁️ SEGUIDORES (${watchers.length})</p>
              <ul class="max-h-24 overflow-y-auto bg-white p-2 rounded border border-slate-200">
                ${watchersListHTML}
              </ul>
            </div>
            <div class="pt-2 border-t border-slate-200">
              <p class="text-xs font-bold text-slate-600 mb-2">TAREFAS ATRIBUÍDAS (${assignedTasks.length})</p>
              <ul class="max-h-24 overflow-y-auto bg-white p-2 rounded border border-slate-200">
                ${tasksListHTML}
              </ul>
            </div>
          </div>

          <!-- Right Column: Editable Fields -->
          <div class="space-y-4">
            ${window.appContext.currentUserRole === 'MEMBER' ? `
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p class="text-xs text-amber-700 font-semibold">ℹ️ Apenas tarefas podem ser editadas</p>
                <p class="text-xs text-amber-600">Como membro, você não pode editar os dados do utilizador</p>
              </div>
            ` : ''}
            ${window.appContext.currentUserRole === 'VIEWER' ? `
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p class="text-xs text-blue-700 font-semibold">👁️ Modo Visualização</p>
                <p class="text-xs text-blue-600">Como visualizador, você só pode ver as informações. Nenhuma alteração permitida</p>
              </div>
            ` : ''}
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">FOTO (opcional)</label>
              <input id="editUserPhoto" type="file" accept="image/*" ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'disabled' : ''} class="w-full border border-slate-200 rounded px-3 py-2 text-xs cursor-pointer ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'opacity-50 bg-slate-100' : ''}">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">NOME</label>
              <input id="editUserName" type="text" value="${user.name}" ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'disabled' : ''} class="w-full border border-slate-200 rounded px-3 py-2 text-xs ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'opacity-50 bg-slate-100 cursor-not-allowed' : ''}">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">NOVO E-MAIL</label>
              <input id="editUserEmail" type="email" value="${user.email}" ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'disabled' : ''} class="w-full border border-slate-200 rounded px-3 py-2 text-xs ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'opacity-50 bg-slate-100 cursor-not-allowed' : ''}">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">FUNÇÃO</label>
              <select id="editUserRole" ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'disabled' : ''} class="w-full border border-slate-200 rounded px-3 py-2 text-xs ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'opacity-50 bg-slate-100 cursor-not-allowed' : ''}">
                <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                <option value="MANAGER" ${user.role === 'MANAGER' ? 'selected' : ''}>MANAGER</option>
                <option value="MEMBER" ${user.role === 'MEMBER' ? 'selected' : ''}>MEMBER</option>
                <option value="VIEWER" ${user.role === 'VIEWER' ? 'selected' : ''}>VIEWER</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">NÍVEL VIP</label>
              <select id="editUserVIPLevel" ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'disabled' : ''} class="w-full border border-slate-200 rounded px-3 py-2 text-xs ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'opacity-50 bg-slate-100 cursor-not-allowed' : ''}">
                <option value="0" ${window.priorityManager.getPriority(user) === 0 ? 'selected' : ''}>Sem VIP</option>
                <option value="1" ${window.priorityManager.getPriority(user) === 1 ? 'selected' : ''}>🔵 Nível 1 (Bronze)</option>
                <option value="2" ${window.priorityManager.getPriority(user) === 2 ? 'selected' : ''}>🟡 Nível 2 (Prata)</option>
                <option value="3" ${window.priorityManager.getPriority(user) === 3 ? 'selected' : ''}>🟠 Nível 3 (Ouro)</option>
                <option value="4" ${window.priorityManager.getPriority(user) === 4 ? 'selected' : ''}>🔴 Nível 4 (Platina)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
          <button onclick="window.renderModals.closeEditUserModal()" class="px-4 py-2 bg-gray-200 rounded text-xs font-semibold">Fechar</button>
          <button ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'disabled' : ''} onclick="window.renderModals.saveEditUser(${userId})" class="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold ${(window.appContext.currentUserRole === 'MEMBER' || window.appContext.currentUserRole === 'VIEWER') ? 'opacity-50 cursor-not-allowed' : ''}">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Removes edit user modal from DOM
  closeEditUserModal(): void {
    const modal = document.getElementById('editUserModal');
    if (modal) modal.remove();
  }

  // Validates and saves updated user data (handles photo upload and VIP level)
  saveEditUser(userId: number): void {
    const nameInput = document.getElementById('editUserName') as HTMLInputElement;
    const emailInput = document.getElementById('editUserEmail') as HTMLInputElement;
    const roleSelect = document.getElementById('editUserRole') as HTMLSelectElement;
    const vipLevelSelect = document.getElementById('editUserVIPLevel') as HTMLSelectElement;
    const photoInput = document.getElementById('editUserPhoto') as HTMLInputElement;
    
    if (!nameInput?.value || !emailInput?.value || !roleSelect?.value) {
      window.appContext.notificationService.addNotification('Por favor, preencha todos os campos!', 'warning');
      return;
    }
    
    // Prevent managers from editing admin users
    const userBeingEdited = window.appContext.userService.getUserById(userId);
    if (window.appContext.currentUserRole === 'MANAGER' && userBeingEdited?.role === 'ADMIN') {
      window.appContext.notificationService.addNotification('Gerentes não podem modificar utilizadores administradores!', 'warning');
      return;
    }

    const updateData: any = {
      name: nameInput.value,
      email: emailInput.value,
      role: roleSelect.value
    };

    // Handle VIP level
    if (vipLevelSelect && userBeingEdited) {
      const vipLevel = parseInt(vipLevelSelect.value);
      window.priorityManager.setPriority(userBeingEdited, vipLevel);
      if (vipLevel > 0) {
        SystemLogger.log(`Nível VIP de "${userBeingEdited.name}" alterado para ${vipLevel}`);
      }
    }

    // Handle photo if provided
    if (photoInput?.files && photoInput.files.length > 0) {
      const file = photoInput.files[0];
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        updateData.photo = event.target?.result as string;
        this.performUserUpdate(userId, updateData);
      };
      reader.readAsDataURL(file);
    } else {
      // No photo selected, proceed with update
      this.performUserUpdate(userId, updateData);
    }
  }

  // Performs the actual user update and handles success/error responses
  private performUserUpdate(userId: number, updateData: any): void {
    const result = window.appContext.userService.updateUser(userId, updateData);

    if (result) {
      window.appContext.notificationService.addNotification('Utilizador atualizado com sucesso!', 'success');
      SystemLogger.log(`Utilizador ${result.name} atualizado`);
      this.closeEditUserModal();
      window.appContext.saveAndRender();
    } else {
      window.appContext.notificationService.addNotification('Erro ao atualizar utilizador. O e-mail pode já estar em uso!', 'warning');
    }
  }

  // Opens modal to create a new user
  openCreateUserModal(): void {
    const modalId = 'createUserModal';
    
    // Close any existing create user modal
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-[85vw] max-w-2xl p-6 border border-slate-100 max-h-[90vh] overflow-y-auto flex flex-col">
        <h3 class="font-bold text-base mb-4">Criar Novo Utilizador</h3>
        
        <div class="space-y-4 flex-1">
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">NOME</label>
            <input id="createUserName" type="text" placeholder="Nome completo" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">E-MAIL</label>
            <input id="createUserEmail" type="email" placeholder="Email institucional" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">FOTO (opcional)</label>
            <input id="createUserPhoto" type="file" accept="image/*" class="w-full border border-slate-200 rounded px-3 py-2 text-xs cursor-pointer">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">FUNÇÃO</label>
            <select id="createUserRole" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="MEMBER">MEMBER</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
          <button onclick="window.renderModals.closeCreateUserModal()" class="px-4 py-2 bg-gray-200 rounded text-xs font-semibold">Fechar</button>
          <button onclick="window.renderModals.saveCreateUser()" class="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  closeCreateUserModal(): void {
    const modal = document.getElementById('createUserModal');
    if (modal) modal.remove();
  }

  saveCreateUser(): void {
    const nameInput = document.getElementById('createUserName') as HTMLInputElement;
    const emailInput = document.getElementById('createUserEmail') as HTMLInputElement;
    const roleSelect = document.getElementById('createUserRole') as HTMLSelectElement;
    const photoInput = document.getElementById('createUserPhoto') as HTMLInputElement;
    
    if (!nameInput?.value || !emailInput?.value || !roleSelect?.value) {
      window.appContext.notificationService.addNotification('Por favor, preencha todos os campos!', 'warning');
      return;
    }
    
    // Handle photo if selected
    if (photoInput?.files?.length) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newUser = window.appContext.userService.addUser(
          emailInput.value, 
          nameInput.value, 
          roleSelect.value, 
          event.target?.result as string
        );
        if (newUser) {
          SystemLogger.log(`Utilizador "${nameInput.value}" criado com função ${roleSelect.value}`);
          this.closeCreateUserModal();
          window.appContext.saveAndRender();
        }
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      const newUser = window.appContext.userService.addUser(
        emailInput.value, 
        nameInput.value, 
        roleSelect.value
      );
      if (newUser) {
        SystemLogger.log(`Utilizador "${nameInput.value}" criado com função ${roleSelect.value}`);
        this.closeCreateUserModal();
        window.appContext.saveAndRender();
      }
    }
  }

  // Opens modal to create a new task
  openCreateTaskModal(): void {
    const modalId = 'createTaskModal';
    
    // Close any existing create task modal
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-[85vw] max-w-2xl p-6 border border-slate-100 max-h-[90vh] overflow-y-auto flex flex-col">
        <h3 class="font-bold text-base mb-4">Criar Nova Tarefa</h3>
        
        <div class="space-y-4 flex-1">
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">TÍTULO</label>
            <input id="createTaskTitle" type="text" placeholder="Título da tarefa" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">TIPO</label>
            <select id="createTaskType" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
              <option value="bug">Erro</option>
              <option value="feature">Funcionalidade</option>
              <option value="task">Tarefa</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">DEADLINE (opcional)</label>
            <input id="createTaskDeadline" type="date" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">ADICIONAR FICHEIRO (opcional)</label>
            <input type="file" id="createTaskFileInput" class="w-full text-xs" onchange="window.renderModals.handleTaskFileUpload(event)">
            <p class="text-[10px] text-slate-400 mt-1">Pode adicionar anexos à tarefa</p>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
          <button onclick="window.renderModals.closeCreateTaskModal()" class="px-4 py-2 bg-gray-200 rounded text-xs font-semibold">Fechar</button>
          <button onclick="window.renderModals.saveCreateTask()" class="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  closeCreateTaskModal(): void {
    const modal = document.getElementById('createTaskModal');
    if (modal) modal.remove();
  }

  handleTaskFileUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      // Store the file data in a data attribute for later use in saveCreateTask()
      const fileDataAttr = (document.getElementById('createTaskFileInput') as any);
      if (fileDataAttr) {
        fileDataAttr.dataset.fileUrl = e.target?.result as string;
        fileDataAttr.dataset.fileName = file.name;
        fileDataAttr.dataset.fileSize = file.size.toString();
      }
      SystemLogger.log(`Ficheiro selecionado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    };
    reader.readAsDataURL(file);
  }

  saveCreateTask(): void {
    const titleInput = document.getElementById('createTaskTitle') as HTMLInputElement;
    const typeSelect = document.getElementById('createTaskType') as HTMLSelectElement;
    const deadlineInput = document.getElementById('createTaskDeadline') as HTMLInputElement;
    const fileInput = document.getElementById('createTaskFileInput') as HTMLInputElement;
    
    if (!titleInput?.value || !typeSelect?.value) {
      window.appContext.notificationService.addNotification('Por favor, preencha todos os campos!', 'warning');
      return;
    }
    
    const newTask = window.appContext.taskService.addTask(titleInput.value, typeSelect.value, deadlineInput?.value);
    
    if (deadlineInput?.value) {
      window.appContext.deadlineService.setDeadline(newTask.id, new Date(deadlineInput.value));
    }
    
    // Handle file attachment if provided
    const fileDataAttr = (fileInput as any);
    if (fileDataAttr?.dataset?.fileUrl) {
      window.appContext.attachmentService.addAttachment(newTask.id, {
        taskId: newTask.id,
        filename: fileDataAttr.dataset.fileName,
        size: parseInt(fileDataAttr.dataset.fileSize),
        url: fileDataAttr.dataset.fileUrl,
      });
      SystemLogger.log(`Ficheiro "${fileDataAttr.dataset.fileName}" anexado à tarefa "${newTask.title}"`);
      window.appContext.notificationService.addNotification(`Ficheiro "${fileDataAttr.dataset.fileName}" anexado!`, 'success');
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
    
    window.appContext.notificationService.addNotification('Tarefa criada!', 'success');
    this.closeCreateTaskModal();
    window.appContext.saveAndRender();
  }

  // Opens modal to display system configuration and statistics
  openSystemConfigModal(): void {
    const modalId = 'systemConfigModal';
    
    // Close any existing modal
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

    // Get current stats
    const sysInfo = SystemConfig.getInfo();
    const totalEntities = BaseEntity.getTotalEntities();
    const idCounter = IdGenerator.getCounter();

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-[85vw] max-w-2xl p-6 border border-slate-100 max-h-[90vh] overflow-y-auto flex flex-col">
        <h3 class="font-bold text-base mb-4">⚙️ Configuração Global</h3>
        
        <div class="space-y-6 flex-1 text-xs">
          <!-- System Info -->
          <div class="border-b border-slate-200 pb-4">
            <h4 class="font-bold text-slate-700 mb-3">Informações do Sistema</h4>
            <div class="space-y-2 text-slate-600">
              <div class="flex justify-between">
                <span>Aplicação:</span>
                <span class="font-semibold text-slate-900">${sysInfo.appName}</span>
              </div>
              <div class="flex justify-between">
                <span>Versão:</span>
                <span class="font-semibold text-slate-900">${sysInfo.version}</span>
              </div>
              <div class="flex justify-between">
                <span>Ambiente:</span>
                <span class="font-semibold text-slate-900">${sysInfo.environment}</span>
              </div>
              <div class="flex justify-between">
                <span>Debug Mode:</span>
                <span class="font-semibold ${sysInfo.debugMode ? 'text-red-600' : 'text-green-600'}">${sysInfo.debugMode ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </div>

          <!-- ID Generator -->
          <div class="border-b border-slate-200 pb-4">
            <h4 class="font-bold text-slate-700 mb-3">ID Generator</h4>
            <div class="space-y-2 text-slate-600">
              <div class="flex justify-between">
                <span>Contador Atual:</span>
                <span class="font-bold text-purple-600">${idCounter}</span>
              </div>
            </div>
          </div>

          <!-- Business Rules -->
          <div class="border-b border-slate-200 pb-4">
            <h4 class="font-bold text-slate-700 mb-3">Business Rules (6)</h4>
            <div class="text-[9px] space-y-1 text-slate-600">
              <div>✓ Validação de Título (5-100 chars)</div>
              <div>✓ Validação de Prioridade</div>
              <div>✓ Validação de Role</div>
              <div>✓ Tarefa Concluída (não bloqueada)</div>
              <div>✓ Tarefa Atribuída (user ativo)</div>
              <div>✓ Desativação de User (0 tarefas)</div>
            </div>
          </div>

          <!-- Global Validators -->
          <div class="border-b border-slate-200 pb-4">
            <h4 class="font-bold text-slate-700 mb-3">Global Validators (7)</h4>
            <div class="text-[9px] space-y-1 text-slate-600">
              <div>✓ Email Validation</div>
              <div>✓ Non-Empty Text</div>
              <div>✓ Positive Numbers</div>
              <div>✓ Min/Max Length</div>
              <div>✓ URL Validation</div>
              <div>✓ Date Validation</div>
              <div>✓ Text Trimming</div>
            </div>
          </div>

          <!-- Statistics -->
          <div>
            <h4 class="font-bold text-slate-700 mb-3">Estatísticas</h4>
            <div class="space-y-2 text-slate-600">
              <div class="flex justify-between">
                <span>Total de Entidades:</span>
                <span class="font-bold text-indigo-600">${totalEntities}</span>
              </div>
              <div class="flex justify-between">
                <span>Total de Logs:</span>
                <span class="font-bold text-indigo-600">${SystemLogger.count()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
          <button onclick="window.renderModals.closeSystemConfigModal()" class="px-4 py-2 bg-gray-200 rounded text-xs font-semibold">Fechar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  closeSystemConfigModal(): void {
    const modal = document.getElementById('systemConfigModal');
    if (modal) modal.remove();
  }
}