// ===== MODAL RENDERER - Generic modal rendering (confirmation, edit, etc) =====
export class RenderModals {
    taskService;
    userService;
    pendingDeleteAction = null;
    constructor(taskService, userService) {
        this.taskService = taskService;
        this.userService = userService;
    }
    // ===== CONFIRMATION MODAL =====
    openConfirmModal(message, confirmCallback) {
        const msgEl = document.getElementById('modalMessage');
        const modalEl = document.getElementById('confirmModal');
        if (msgEl)
            msgEl.innerText = message;
        if (modalEl)
            modalEl.classList.remove('hidden');
        this.pendingDeleteAction = confirmCallback;
    }
    closeConfirmModal() {
        const modalEl = document.getElementById('confirmModal');
        if (modalEl)
            modalEl.classList.add('hidden');
    }
    confirmAction() {
        if (this.pendingDeleteAction)
            this.pendingDeleteAction();
        this.closeConfirmModal();
    }
    // ===== EDIT TITLE MODAL =====
    openEditTitleModal(taskId) {
        const task = this.taskService.getTaskById(taskId);
        if (!task)
            return;
        if (document.getElementById('editTitleModal'))
            return;
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
            document.getElementById('editTitleInput')?.focus();
        }, 50);
    }
    closeEditTitleModal() {
        const modal = document.getElementById('editTitleModal');
        if (modal)
            modal.remove();
    }
    saveEditTitle(taskId) {
        const input = document.getElementById('editTitleInput');
        if (!input)
            return;
        const newTitle = input.value.trim();
        if (!newTitle)
            return;
        const task = this.taskService.getTaskById(taskId);
        if (!task)
            return;
        const oldTitle = task.title;
        this.taskService.updateTaskTitle(taskId, newTitle);
        window.services.logService.addLog(`Tarefa renomeada: "${oldTitle}" -> "${newTitle}"`);
        this.closeEditTitleModal();
        window.saveAndRender();
    }
}
//# sourceMappingURL=renderModals.js.map