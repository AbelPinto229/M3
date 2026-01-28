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
}
