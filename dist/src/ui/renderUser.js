// ===== USER RENDERER - All user-related rendering =====
export class RenderUser {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    render() {
        const userSearchTerm = document.getElementById('searchUser')?.value.toLowerCase() || '';
        const userList = document.getElementById('userList');
        if (!userList)
            return;
        const roleColors = {
            ADMIN: 'text-red-500 bg-red-50 border-red-100',
            MANAGER: 'text-amber-600 bg-amber-50 border-amber-100',
            MEMBER: 'text-indigo-600 bg-indigo-50 border-indigo-100',
            VIEWER: 'text-slate-500 bg-slate-50 border-slate-100',
        };
        userList.innerHTML = this.userService
            .getUsers()
            .filter(u => u.email.toLowerCase().includes(userSearchTerm))
            .map((u) => `
      <tr class="group hover:bg-slate-50 transition-colors">
        <td class="py-3 font-medium text-slate-700">${u.email} <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block mt-1 ${roleColors[u.role] || 'bg-slate-50'}">${u.role}</span></td>
        <td class="py-3 text-center">
          <button onclick="window.renderUser.toggleUserStatus(${u.id})" class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}">${u.active ? 'ATIVO' : 'INATIVO'}</button>
        </td>
        <td class="py-3 text-right">
          <button onclick="window.renderUser.deleteUser(${u.id})" class="text-slate-300 hover:text-red-500 transition-colors">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </td>
      </tr>`)
            .join('');
    }
    // ===== USER ACTIONS =====
    toggleUserStatus(id) {
        this.userService.toggleUserStatus(id);
        window.saveAndRender();
    }
    deleteUser(id) {
        const user = this.userService.getUserById(id);
        if (!user)
            return;
        // Trigger confirmation modal
        window.renderModals.openConfirmModal(`Eliminar ${user.email}?`, () => {
            this.userService.deleteUser(id);
            window.saveAndRender();
        });
    }
}
//# sourceMappingURL=renderUser.js.map