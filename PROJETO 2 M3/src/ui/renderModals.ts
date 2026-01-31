// ===== MODAL RENDERER - Generic modal rendering (confirmation, edit, etc) =====

import { TaskService, ExtendedTask } from '../services/TaskService.js';
import { UserService } from '../services/UserService.js';
import { SystemLogger } from '../logs/SystemLogger.js';

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
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">FOTO (opcional)</label>
              <input id="editUserPhoto" type="file" accept="image/*" class="w-full border border-slate-200 rounded px-3 py-2 text-xs cursor-pointer">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">NOME</label>
              <input id="editUserName" type="text" value="${user.name}" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">NOVO E-MAIL</label>
              <input id="editUserEmail" type="email" value="${user.email}" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">FUNÇÃO</label>
              <select id="editUserRole" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
                <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                <option value="MANAGER" ${user.role === 'MANAGER' ? 'selected' : ''}>MANAGER</option>
                <option value="MEMBER" ${user.role === 'MEMBER' ? 'selected' : ''}>MEMBER</option>
                <option value="VIEWER" ${user.role === 'VIEWER' ? 'selected' : ''}>VIEWER</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 block mb-1">NÍVEL VIP</label>
              <select id="editUserVIPLevel" class="w-full border border-slate-200 rounded px-3 py-2 text-xs">
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
          <button onclick="window.renderModals.saveEditUser(${userId})" class="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold">Guardar</button>
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
}

