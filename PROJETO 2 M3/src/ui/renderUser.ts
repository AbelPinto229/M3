// ===== USER RENDERER - All user-related rendering =====

import { UserService } from '../services/UserService.js';

export class RenderUser {
  constructor(private userService: UserService) {}

  // Renders user list table with search and filter functionality
  render(): void {
    // Get search term and apply active/inactive filter
    const userSearchTerm = (document.getElementById('searchUser') as HTMLInputElement)?.value.toLowerCase() || '';
    const userFilter = window.appContext.userFilter || 'all';

    // Filter users by name or email, then by active status if selected
    let filteredUsers = this.userService
      .getUsers()
      .filter(u => u.email.toLowerCase().includes(userSearchTerm) || u.name.toLowerCase().includes(userSearchTerm));
    
    if (userFilter === 'active') {
      filteredUsers = filteredUsers.filter(u => u.active);
    } else if (userFilter === 'inactive') {
      filteredUsers = filteredUsers.filter(u => !u.active);
    } else if (userFilter === 'favorites') {
      filteredUsers = filteredUsers.filter(u => window.favoriteUsers.exists(u));
    }

    // Use pagination to render users
    window.renderUsersWithPagination(filteredUsers);
  }

  // Renders a single user row
  renderUserRow(u: any): string {
    const roleColors: Record<string, string> = {
      ADMIN: 'text-red-500 bg-red-50 border-red-100',
      MANAGER: 'text-amber-600 bg-amber-50 border-amber-100',
      MEMBER: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      VIEWER: 'text-slate-500 bg-slate-50 border-slate-100',
    };

    const canToggle = window.appContext.checkPermission?.('toggle_user');
    const canDelete = window.appContext.checkPermission?.('delete_user');
    const canEdit = window.appContext.checkPermission?.('edit_user');
    
    const isFavorite = window.favoriteUsers.exists(u);
    const favoriteStarClass = isFavorite ? 'favorite-star active' : 'favorite-star inactive';
    
    const photoHTML = u.photo ? `<img src="${u.photo}" alt="${u.name}" class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200">` : `<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">${u.name.charAt(0).toUpperCase()}</div>`;
    
    const allTasks = window.appContext.taskService.getTasks?.() || [];
    const assignedTaskCount = allTasks.filter((t: any) => t.assigned && t.assigned.includes(u.email)).length;
    
    return `
      <tr class="group hover:bg-slate-50 transition-colors cursor-pointer" onclick="window.appContext.renderUser.showUserDetails(${u.id})">
        <td class="py-3 font-medium text-slate-700 flex items-center gap-3">
          <span class="${favoriteStarClass}" onclick="event.stopPropagation(); window.appContext.renderUser.toggleUserFavorite(${u.id})">★</span>
          ${photoHTML}
          <div class="flex flex-col gap-1">
            <span>${u.name} <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block ml-1 ${roleColors[u.role] || 'bg-slate-50'}">${u.role}</span></span>
            <span class="text-[11px] text-slate-500 font-normal">Tarefas atribuídas: ${assignedTaskCount}</span>
          </div>
        </td>
        <td class="py-3 text-center" onclick="event.stopPropagation()">
          <button ${canToggle ? '' : 'disabled'} onclick="event.stopPropagation(); ${canToggle ? `window.appContext.renderUser.toggleUserStatus(${u.id})` : 'return false'}" class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'} ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}">${u.active ? 'ATIVO' : 'INATIVO'}</button>
        </td>
        <td class="py-3 text-right" onclick="event.stopPropagation()">
          <button ${canEdit ? '' : 'disabled'} onclick="${canEdit ? `window.appContext.renderUser.editUser(${u.id})` : 'return false'}" class="text-slate-300 hover:text-indigo-600 transition-colors ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''} mr-2">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <button ${canDelete ? '' : 'disabled'} onclick="${canDelete ? `window.appContext.renderUser.deleteUser(${u.id})` : 'return false'}" class="text-slate-300 hover:text-red-500 transition-colors ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </td>
      </tr>`;
  }

  // ===== USER ACTIONS =====
  // Toggles user active/inactive status
  toggleUserStatus(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    // Prevent managers from toggling admin users
    if (window.appContext.currentUserRole === 'MANAGER' && user.role === 'ADMIN') {
      window.appContext.notificationService.addNotification('Gerentes não podem modificar utilizadores administradores!', 'warning');
      return;
    }
    
    this.userService.toggleUserStatus(id);
    const updatedUser = this.userService.getUserById(id);
    const newStatus = updatedUser?.active ? 'ATIVO' : 'INATIVO';
    
    window.appContext.notificationService.addNotification(`${user.name} agora está ${newStatus}!`, 'success');
    window.appContext.logService.addLog(`Utilizador ${user.name} estado: ${newStatus}`);
    window.appContext.saveAndRender();
  }

  // Opens confirmation modal to delete user
  deleteUser(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    // Prevent managers from deleting admin users
    if (window.appContext.currentUserRole === 'MANAGER' && user.role === 'ADMIN') {
      window.appContext.notificationService.addNotification('Gerentes não podem eliminar utilizadores administradores!', 'warning');
      return;
    }
    
    // Trigger confirmation modal
    window.appContext.renderModals.openConfirmModal(`Eliminar ${user.email}?`, () => {
      this.userService.deleteUser(id);
      window.appContext.notificationService.addNotification(`${user.name} eliminado!`, 'success');
      window.appContext.logService.addLog(`Utilizador ${user.name} eliminado`);
      window.appContext.saveAndRender();
    });
  }

  // Displays detailed user information in a modal
  showUserDetails(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    // Use user photo or generate avatar with user initial
    const photoHTML = user.photo ? `<img src="${user.photo}" alt="${user.name}" class="w-20 h-20 rounded-full object-cover border-2 border-slate-200 mx-auto mb-4">` : `<div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">${user.name.charAt(0).toUpperCase()}</div>`;
    
    // Get tasks assigned to this user (by email, not ID)
    const assignedTasks = window.appContext.taskService.getTasks().filter((t: any) => t.assigned && Array.isArray(t.assigned) && t.assigned.some((email: any) => String(email) === String(user.email)));
    const tasksListHTML = assignedTasks.length > 0 
      ? assignedTasks.map((t: any) => `<li class="text-sm text-slate-700">• ${t.title} <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${t.status}</span></li>`).join('')
      : '<li class="text-sm text-slate-500 italic">Nenhuma tarefa atribuída</li>';
    
    const detailsContent = `
      <div class="space-y-4">
        ${photoHTML}
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-bold text-slate-600">ID</p>
            <p class="text-lg font-semibold text-slate-900">${user.id}</p>
          </div>
          <div>
            <p class="text-sm font-bold text-slate-600">FUNÇÃO</p>
            <p class="text-lg font-semibold text-slate-900">${user.role}</p>
          </div>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-600">NOME</p>
          <p class="text-lg font-semibold text-slate-900">${user.name}</p>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-600">E-MAIL</p>
          <p class="text-lg font-semibold text-slate-900">${user.email}</p>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-600">ESTADO</p>
          <p class="text-lg font-semibold ${user.active ? 'text-emerald-600' : 'text-slate-400'}">${user.active ? 'ATIVO' : 'INATIVO'}</p>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-600">TAREFAS ATRIBUÍDAS (${assignedTasks.length})</p>
          <ul class="mt-2 space-y-1">
            ${tasksListHTML}
          </ul>
        </div>
      </div>
    `;
    
    window.appContext.renderModals.openModal(`Detalhes de ${user.name}`, detailsContent);
  }

  // Opens modal to edit user information (name, email, role, photo)
  editUser(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    window.appContext.renderModals.openEditUserModal(id, user);
  }

  // Toggles user favorite status
  toggleUserFavorite(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    if (window.favoriteUsers.exists(user)) {
      window.favoriteUsers.remove(user);
      window.appContext.notificationService.addNotification(`${user.name} removido de favoritos!`, 'info');
    } else {
      window.favoriteUsers.add(user);
      window.appContext.notificationService.addNotification(`${user.name} adicionado aos favoritos!`, 'success');
    }
    
    this.render();
  }
}
