// ===== USER RENDERER - All user-related rendering =====

import { UserService } from '../services/UserService.js';
import { SystemLogger } from '../logs/SystemLogger.js';

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

    // Apply sorting based on sort state
    const sortState = window.appContext.userSortState || 'none';
    if (sortState === 'asc') {
      filteredUsers = filteredUsers.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
    } else if (sortState === 'desc') {
      filteredUsers = filteredUsers.sort((a, b) => 
        b.name.localeCompare(a.name)
      );
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
    const canOpenEditModal = window.appContext.checkPermission?.('open_edit_modal');
    
    const isFavorite = window.favoriteUsers.exists(u);
    const favoriteStarClass = isFavorite ? 'favorite-star active' : 'favorite-star inactive';
    
    const currentUser = window.appContext.userService.getUserById(window.appContext.currentUserId);
    const watchers = window.watcherSystem.getWatchers(u);
    const isWatching = currentUser && watchers.includes(currentUser);
    const watchClass = isWatching ? 'text-blue-600 font-bold' : 'text-slate-400';
    const watchCount = watchers.length;

    // Get VIP priority level from PriorityManager
    const vipLevel = window.priorityManager.getPriority(u) ?? 0;
    const vipBadgeClass = vipLevel > 0 ? 'bg-yellow-200 text-yellow-800 font-bold' : '';
    
    const photoHTML = u.photo ? `<img src="${u.photo}" alt="${u.name}" class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200">` : `<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">${u.name.charAt(0).toUpperCase()}</div>`;
    
    const allTasks = window.appContext.taskService.getTasks?.() || [];
    const assignedTaskCount = allTasks.filter((t: any) => t.assigned && t.assigned.includes(u.email)).length;
    
    return `
      <tr class="group hover:bg-slate-50 transition-colors" data-user-id="${u.id}">
        <td class="py-3 font-medium text-slate-700 flex items-center gap-3">
          <div class="flex flex-col gap-1 items-center pt-1">
            <span class="${favoriteStarClass}" onclick="event.stopPropagation(); window.appContext.renderUser.toggleUserFavorite(${u.id})">★</span>
            <button class="${watchClass} cursor-pointer p-1.5 rounded-md" onclick="event.stopPropagation(); window.appContext.renderUser.toggleUserWatch(${u.id})" data-watch-btn style="display: flex; align-items: center; justify-content: center;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7C7.523 19 3.732 16.057 2.458 12z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <span class=\"text-xs text-slate-400\" data-watch-count>${watchCount}</span>
          </div>
          ${photoHTML}
          <div class="flex flex-col gap-1">
            <span>${u.name} <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block ml-1 ${roleColors[u.role] || 'bg-slate-50'}">${u.role}</span>${vipLevel > 0 ? ` <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block ml-1 ${vipBadgeClass}">VIP ⭐${vipLevel}</span>` : ''}</span>
            <span class="text-[11px] text-slate-500 font-normal">Tarefas atribuídas: ${assignedTaskCount}</span>
          </div>
        </td>
        <td class="py-3 text-center" onclick="event.stopPropagation()">
          <button ${canToggle ? '' : 'disabled'} onclick="event.stopPropagation(); ${canToggle ? `window.appContext.renderUser.toggleUserStatus(${u.id})` : 'return false'}" class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'} ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}">${u.active ? 'ATIVO' : 'INATIVO'}</button>
        </td>
        <td class="py-3 text-right" onclick="event.stopPropagation()">
          <div class="flex flex-col gap-1 items-center">
            <button ${canOpenEditModal ? '' : 'disabled'} onclick="${canOpenEditModal ? `window.appContext.renderUser.editUser(${u.id})` : 'return false'}" class="text-slate-300 hover:text-indigo-600 transition-colors ${!canOpenEditModal ? 'opacity-50 cursor-not-allowed' : ''}" title="Editar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <button ${canDelete ? '' : 'disabled'} onclick="${canDelete ? `window.appContext.renderUser.deleteUser(${u.id})` : 'return false'}" class="text-slate-300 hover:text-red-500 transition-colors ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}" title="Remover">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>
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
    SystemLogger.log(`Utilizador ${user.name} estado: ${newStatus}`);
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
      SystemLogger.log(`Utilizador ${user.name} eliminado`);
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
    
    // Get ratings for the user
    const average = window.ratingSystem.getAverage(user);
    const ratings = window.ratingSystem.getRatings(user);
    const ratingStarsHTML = [1, 2, 3, 4, 5]
      .map(i => {
        const isFilled = i <= Math.round(average);
        return `<button onclick="window.appContext.renderUser.rateUser(${id}, ${i})" class="text-2xl hover:scale-125 transition-transform ${isFilled ? 'text-amber-400' : 'text-amber-200'}" title="Avaliar com ${i} estrelas">${isFilled ? '★' : '☆'}</button>`;
      })
      .join('');
    
    const ratingsInfoHTML = ratings.length === 0 
      ? '<p class="text-slate-500 text-sm">Nenhuma avaliação ainda</p>'
      : `<p class="text-sm"><b>Média:</b> ${average.toFixed(1)} (${ratings.length} avaliações)</p>`;
    
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
          <p class="text-sm font-bold text-slate-600 mb-2">⭐ AVALIAÇÕES</p>
          <div class="flex gap-1 mb-2">
            ${ratingStarsHTML}
          </div>
          ${ratingsInfoHTML}
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

  // Toggles user watch status
  toggleUserWatch(userId: number): void {
    const user = this.userService.getUserById(userId);
    const currentUser = window.appContext.userService.getUserById(window.appContext.currentUserId);
    if (!user || !currentUser) return;
    
    const watchers = window.watcherSystem.getWatchers(user);
    
    if (watchers.includes(currentUser)) {
      window.watcherSystem.unwatch(user, currentUser);
      window.appContext.notificationService.addNotification(`Deixou de seguir ${user.name}!`, 'info');
      SystemLogger.log(`Deixou de seguir o utilizador "${user.name}"`);
    } else {
      window.watcherSystem.watch(user, currentUser);
      window.appContext.notificationService.addNotification(`Agora está a seguir ${user.name}!`, 'success');
      SystemLogger.log(`Agora está a seguir o utilizador "${user.name}"`);
    }
    
    // Only save data, don't re-render
    window.appContext.saveData();
    
    // Update DOM locally only
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (userRow) {
      const watchButton = userRow.querySelector('button[data-watch-btn]');
      const watchCounter = userRow.querySelector('[data-watch-count]');
      
      if (watchButton && watchCounter) {
        const updatedWatchers = window.watcherSystem.getWatchers(user);
        const isWatching = updatedWatchers.includes(currentUser);
        
        // Update counter
        watchCounter.textContent = updatedWatchers.length.toString();
        
        // Update button styling
        const newWatchClass = isWatching ? 'text-blue-600 font-bold' : 'text-slate-400';
        watchButton.className = `${newWatchClass} cursor-pointer p-1.5 rounded-md`;
      }
    }
  }
  // Toggles user favorite status
  toggleUserFavorite(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    if (window.favoriteUsers.exists(user)) {
      window.favoriteUsers.remove(user);
      window.appContext.notificationService.addNotification(`${user.name} removido de favoritos!`, 'info');
      SystemLogger.log(`Utilizador "${user.name}" removido de favoritos`);
    } else {
      window.favoriteUsers.add(user);
      window.appContext.notificationService.addNotification(`${user.name} adicionado aos favoritos!`, 'success');
      SystemLogger.log(`Utilizador "${user.name}" adicionado aos favoritos`);
    }
    
    window.appContext.saveAndRender();
  }

  // ===== VIP PRIORITY MANAGEMENT =====
  // Set VIP priority level for a user (1-4)
  setUserVIPLevel(userId: number, vipLevel: number): void {
    const user = this.userService.getUserById(userId);
    if (!user) return;

    const level = parseInt(vipLevel.toString());
    if (level >= 0 && level <= 4) {
      window.priorityManager.setPriority(user, level);
      if (level === 0) {
        window.appContext.notificationService.addNotification(`Nível VIP removido de "${user.name}"`, 'info');
      } else {
        window.appContext.notificationService.addNotification(`${user.name} agora é VIP ⭐${level}!`, 'success');
      }
      SystemLogger.log(`Nível VIP de "${user.name}" alterado para ${level}`);
      window.appContext.saveAndRender();
    }
  }

  // Get VIP level for a user
  getUserVIPLevel(userId: number): number | undefined {
    const user = this.userService.getUserById(userId);
    if (!user) return undefined;
    return window.priorityManager.getPriority(user);
  }

  // ===== RATING MANAGEMENT =====
  // Rate a user with a value 1-5
  rateUser(userId: number, rating: number): void {
    const user = this.userService.getUserById(userId);
    if (!user) return;

    if (rating < 1 || rating > 5) {
      window.appContext.notificationService.addNotification('Avaliação deve estar entre 1 e 5', 'warning');
      return;
    }

    window.ratingSystem.rate(user, rating);
    window.appContext.notificationService.addNotification(`Utilizador avaliado com ${rating} ⭐!`, 'success');
    SystemLogger.log(`Utilizador "${user.name}" avaliado com ${rating} estrelas`);
    
    // Refresh the modal with updated ratings
    this.showUserDetails(userId);
    window.appContext.saveData();
  }
}