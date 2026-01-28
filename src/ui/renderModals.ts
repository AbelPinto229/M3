// ===== MODAL RENDERER - Generic modal rendering (confirmation, edit, etc) =====

import { TaskService, ExtendedTask } from '../services/TaskService.js';
import { UserService } from '../services/UserService.js';

export class RenderModals {
  private pendingDeleteAction: (() => void) | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  // ===== CONFIRMATION MODAL =====
  openConfirmModal(message: string, confirmCallback: () => void): void {
    const msgEl = document.getElementById('modalMessage');
    const modalEl = document.getElementById('confirmModal');
    if (msgEl) msgEl.innerText = message;
    if (modalEl) modalEl.classList.remove('hidden');
    this.pendingDeleteAction = confirmCallback;
  }

  closeConfirmModal(): void {
    const modalEl = document.getElementById('confirmModal');
    if (modalEl) modalEl.classList.add('hidden');
  }

  confirmAction(): void {
    if (this.pendingDeleteAction) this.pendingDeleteAction();
    this.closeConfirmModal();
  }

  // ===== EDIT TITLE MODAL =====
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
          <button onclick="window.renderModals.saveEditTitle(${taskId})" class="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Salvar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
      (document.getElementById('editTitleInput') as HTMLInputElement)?.focus();
    }, 50);
  }

  closeEditTitleModal(): void {
    const modal = document.getElementById('editTitleModal');
    if (modal) modal.remove();
  }

  saveEditTitle(taskId: number): void {
    const input = document.getElementById('editTitleInput') as HTMLInputElement;
    if (!input) return;

    const newTitle = input.value.trim();
    if (!newTitle) return;

    const task = this.taskService.getTaskById(taskId);
    if (!task) return;

    const oldTitle = task.title;
    this.taskService.updateTaskTitle(taskId, newTitle);
    window.services.logService.addLog(`Tarefa renomeada: "${oldTitle}" -> "${newTitle}"`);
    
    this.closeEditTitleModal();
    (window as any).saveAndRender();
  }

  // ===== GENERIC MODAL =====
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
          <button onclick="window.renderModals.closeModal()" class="px-4 py-2 bg-gray-200 rounded text-sm">Fechar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  closeModal(): void {
    const modal = document.getElementById('genericModal');
    if (modal) modal.remove();
  }

  // ===== EDIT USER MODAL =====
  openEditUserModal(userId: number, user: any): void {
    const modalId = 'editUserModal';
    
    // Close any existing edit user modal
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 class="font-bold text-lg mb-4">Editar ${user.name}</h3>
        <div class="space-y-3 mb-4">
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">FOTO (opcional)</label>
            <input id="editUserPhoto" type="file" accept="image/*" class="w-full border border-slate-200 rounded px-3 py-2 text-sm cursor-pointer">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">NOME</label>
            <input id="editUserName" type="text" value="${user.name}" class="w-full border border-slate-200 rounded px-3 py-2 text-sm">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">EMAIL</label>
            <input id="editUserEmail" type="email" value="${user.email}" class="w-full border border-slate-200 rounded px-3 py-2 text-sm">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">ROLE</label>
            <select id="editUserRole" class="w-full border border-slate-200 rounded px-3 py-2 text-sm">
              <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
              <option value="MANAGER" ${user.role === 'MANAGER' ? 'selected' : ''}>MANAGER</option>
              <option value="MEMBER" ${user.role === 'MEMBER' ? 'selected' : ''}>MEMBER</option>
              <option value="VIEWER" ${user.role === 'VIEWER' ? 'selected' : ''}>VIEWER</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button onclick="window.renderModals.closeEditUserModal()" class="px-4 py-2 bg-gray-200 rounded text-sm">Cancelar</button>
          <button onclick="window.renderModals.saveEditUser(${userId})" class="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Salvar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  closeEditUserModal(): void {
    const modal = document.getElementById('editUserModal');
    if (modal) modal.remove();
  }

  saveEditUser(userId: number): void {
    const nameInput = document.getElementById('editUserName') as HTMLInputElement;
    const emailInput = document.getElementById('editUserEmail') as HTMLInputElement;
    const roleSelect = document.getElementById('editUserRole') as HTMLSelectElement;
    const photoInput = document.getElementById('editUserPhoto') as HTMLInputElement;
    
    if (!nameInput?.value || !emailInput?.value || !roleSelect?.value) {
      window.services.notificationService.addNotification('Por favor, preencha todos os campos!', 'warning');
      return;
    }

    const updateData: any = {
      name: nameInput.value,
      email: emailInput.value,
      role: roleSelect.value
    };

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

  private performUserUpdate(userId: number, updateData: any): void {
    const result = window.services.userService.updateUser(userId, updateData);

    if (result) {
      window.services.notificationService.addNotification('Utilizador atualizado!', 'success');
      window.services.logService.addLog(`Utilizador ${result.name} atualizado`);
      this.closeEditUserModal();
      (window as any).saveAndRender();
    } else {
      window.services.notificationService.addNotification('Erro ao atualizar utilizador. Email pode já estar em uso!', 'warning');
    }
  }
}
