// ===== USER RENDERER - All user-related rendering =====

import { UserService } from '../services/UserService.js';
import { SystemLogger } from '../logs/SystemLogger.js';

const API_URL = 'http://localhost:3000';

// Cache for async data (watchers/ratings)
interface UserExtraData {
  watcherCount: number;
  isWatching: boolean;
  ratingAvg: number;
  ratingCount: number;
}

const userExtraCache: Map<number, UserExtraData> = new Map();

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
      filteredUsers = filteredUsers.filter(u => window.favoriteUserIds.has(u.id));
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
    
    // Load async data (watchers/ratings) for visible users and refresh
    this.loadExtraDataForUsers(filteredUsers);
  }

  // Load watcher counts and rating data from API for all users
  private async loadExtraDataForUsers(users: any[]): Promise<void> {
    const currentUserId = window.appContext.currentUserId;
    try {
      const results = await Promise.all(users.map(async (u: any) => {
        const [watchersRes, isWatchingRes, ratingRes] = await Promise.all([
          fetch(`${API_URL}/user-watchers/${u.id}/count`).then(r => r.ok ? r.json() : { count: 0 }),
          fetch(`${API_URL}/user-watchers/${u.id}/is-watching/${currentUserId}`).then(r => r.ok ? r.json() : { watching: false }),
          fetch(`${API_URL}/user-ratings/${u.id}/average`).then(r => r.ok ? r.json() : { average: 0, count: 0 })
        ]);
        return {
          id: u.id,
          watcherCount: watchersRes.count || 0,
          isWatching: isWatchingRes.watching || false,
          ratingAvg: ratingRes.average || 0,
          ratingCount: ratingRes.count || 0
        };
      }));
      
      let changed = false;
      for (const r of results) {
        const old = userExtraCache.get(r.id);
        if (!old || old.watcherCount !== r.watcherCount || old.isWatching !== r.isWatching || old.ratingAvg !== r.ratingAvg) {
          userExtraCache.set(r.id, r);
          changed = true;
        }
      }
      
      // Update DOM of already-rendered rows
      if (changed) {
        for (const r of results) {
          const row = document.querySelector(`tr[data-user-id="${r.id}"]`);
          if (!row) continue;
          const watchCounter = row.querySelector('[data-watch-count]');
          if (watchCounter) watchCounter.textContent = String(r.watcherCount);
          const watchBtn = row.querySelector('button[data-watch-btn]');
          if (watchBtn) {
            watchBtn.className = `${r.isWatching ? 'text-blue-600 font-bold' : 'text-slate-400'} cursor-pointer p-1.5 rounded-md`;
          }
        }
      }
    } catch { /* API unavailable, use cached/default values */ }
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
    
    const isFavorite = window.favoriteUserIds.has(u.id);
    const favoriteStarClass = isFavorite ? 'favorite-star active' : 'favorite-star inactive';
    
    const currentUser = window.appContext.userService.getUserById(window.appContext.currentUserId);
    const cached = userExtraCache.get(u.id);
    const isWatching = cached?.isWatching || false;
    const watchClass = isWatching ? 'text-blue-600 font-bold' : 'text-slate-400';
    const watchCount = cached?.watcherCount || 0;

    // Get VIP level from DB field
    const vipLevel = u.vip_level || 0;
    const vipBadgeClass = vipLevel > 0 ? 'bg-yellow-200 text-yellow-800 font-bold' : '';
    
    const photoHTML = u.photo ? `<img src="${u.photo}" alt="${u.name}" class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200">` : `<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">${u.name.charAt(0).toUpperCase()}</div>`;
    
    const allTasks = window.appContext.taskService.getTasks?.() || [];
    const assignedTaskCount = allTasks.filter((t: any) => t.assigned && t.assigned.includes(u.email)).length;
    
    const isAdmin = ['ADMIN', 'MANAGER'].includes(window.appContext.currentUserRole);
    
    // Message button (available for all roles, but not for self)
    const messageBtnHTML = u.id !== window.appContext.currentUserId
      ? `<button onclick="event.stopPropagation(); window.openChatWith(${u.id}, '${u.name.replace(/'/g, "\\'")}', '${u.role}')" class="text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer" title="Enviar mensagem">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </button>` : '';

    // Admin/Manager view: toggle active + edit + delete + message
    // Member/Viewer view: online/offline status + send message
    const actionCells = isAdmin ? `
        <td class="py-3 text-center" onclick="event.stopPropagation()">
          <button ${canToggle ? '' : 'disabled'} onclick="event.stopPropagation(); ${canToggle ? `window.appContext.renderUser.toggleUserStatus(${u.id})` : 'return false'}" class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'} ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}">${u.active ? 'ATIVO' : 'INATIVO'}</button>
        </td>
        <td class="py-3 text-right" onclick="event.stopPropagation()">
          <div class="flex flex-col gap-1 items-center">
            ${messageBtnHTML}
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
    ` : `
        <td class="py-3 text-center" onclick="event.stopPropagation()">
          <span class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}">${u.active ? 'ONLINE' : 'OFFLINE'}</span>
        </td>
        <td class="py-3 text-right" onclick="event.stopPropagation()">
          ${u.id !== window.appContext.currentUserId ? `
          <button onclick="event.stopPropagation(); window.openChatWith(${u.id}, '${u.name.replace(/'/g, "\\'")}', '${u.role}')" class="text-[9px] font-bold px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer" title="Enviar mensagem">
            💬 Mensagem
          </button>` : `<span class="text-[9px] text-slate-400 font-bold">EU</span>`}
        </td>
    `;

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
            <span class="text-xs text-slate-400" data-watch-count>${watchCount}</span>
          </div>
          ${photoHTML}
          <div class="flex flex-col gap-1">
            <span>${u.name} <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block ml-1 ${roleColors[u.role] || 'bg-slate-50'}">${u.role}</span>${vipLevel > 0 ? ` <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block ml-1 ${vipBadgeClass}">VIP ⭐${vipLevel}</span>` : ''}</span>
            <span class="text-[11px] text-slate-500 font-normal">Tarefas atribuídas: ${assignedTaskCount}</span>
          </div>
        </td>
        ${actionCells}
      </tr>`;
  }

  // ===== USER ACTIONS =====
  // Toggles user active/inactive status
  async toggleUserStatus(id: number): Promise<void> {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    // Prevent managers from toggling admin users
    if (window.appContext.currentUserRole === 'MANAGER' && user.role === 'ADMIN') {
      window.appContext.notificationService.addNotification('Gerentes não podem modificar utilizadores administradores!', 'warning');
      return;
    }
    
    await this.userService.toggleUserStatus(id);
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
    
    console.log('🗑️ Tentando eliminar user:', user.email, 'ID:', id);
    
    // Prevent managers from deleting admin users
    if (window.appContext.currentUserRole === 'MANAGER' && user.role === 'ADMIN') {
      window.appContext.notificationService.addNotification('Gerentes não podem eliminar utilizadores administradores!', 'warning');
      return;
    }
    
    // Trigger confirmation modal
    window.appContext.renderModals.openConfirmModal(`Eliminar ${user.email}?`, async () => {
      console.log('✅ Confirmação aceite, a executar delete...');
      await this.userService.deleteUser(id);
      console.log('✅ Delete completo, a notificar...');
      window.appContext.notificationService.addNotification(`${user.name} eliminado!`, 'success');
      SystemLogger.log(`Utilizador ${user.name} eliminado`);
      console.log('✅ A chamar saveAndRender...');
      window.appContext.saveAndRender();
      console.log('✅ Processo de eliminação completo!');
    });
  }

  // Displays detailed user information in a modal
  async showUserDetails(id: number): Promise<void> {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    // Use user photo or generate avatar with user initial
    const photoHTML = user.photo ? `<img src="${user.photo}" alt="${user.name}" class="w-20 h-20 rounded-full object-cover border-2 border-slate-200 mx-auto mb-4">` : `<div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">${user.name.charAt(0).toUpperCase()}</div>`;
    
    // Get tasks assigned to this user (by email, not ID)
    const assignedTasks = window.appContext.taskService.getTasks().filter((t: any) => t.assigned && Array.isArray(t.assigned) && t.assigned.some((email: any) => String(email) === String(user.email)));
    const tasksListHTML = assignedTasks.length > 0 
      ? assignedTasks.map((t: any) => `<li class="text-sm text-slate-700">• ${t.title} <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${t.status}</span></li>`).join('')
      : '<li class="text-sm text-slate-500 italic">Nenhuma tarefa atribuída</li>';
    
    // Get ratings from API
    let average = 0;
    let ratingCount = 0;
    try {
      const res = await fetch(`${API_URL}/user-ratings/${id}/average`);
      if (res.ok) {
        const data = await res.json();
        average = data.average || 0;
        ratingCount = data.count || 0;
      }
    } catch { /* use defaults */ }
    
    const ratingStarsHTML = [1, 2, 3, 4, 5]
      .map(i => {
        const isFilled = i <= Math.round(average);
        return `<button onclick="window.appContext.renderUser.rateUser(${id}, ${i})" class="text-2xl hover:scale-125 transition-transform ${isFilled ? 'text-amber-400' : 'text-amber-200'}" title="Avaliar com ${i} estrelas">${isFilled ? '★' : '☆'}</button>`;
      })
      .join('');
    
    const ratingsInfoHTML = ratingCount === 0 
      ? '<p class="text-slate-500 text-sm">Nenhuma avaliação ainda</p>'
      : `<p class="text-sm"><b>Média:</b> ${average.toFixed(1)} (${ratingCount} avaliações)</p>`;
    
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
  async toggleUserWatch(userId: number): Promise<void> {
    const user = this.userService.getUserById(userId);
    const currentUserId = window.appContext.currentUserId;
    if (!user) return;
    
    const cached = userExtraCache.get(userId);
    const isWatching = cached?.isWatching || false;
    
    try {
      if (isWatching) {
        await fetch(`${API_URL}/user-watchers/${userId}/watcher/${currentUserId}`, { method: 'DELETE' });
        window.appContext.notificationService.addNotification(`Deixou de seguir ${user.name}!`, 'info');
        SystemLogger.log(`Deixou de seguir o utilizador "${user.name}"`);
      } else {
        await fetch(`${API_URL}/user-watchers/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ watcher_id: currentUserId })
        });
        window.appContext.notificationService.addNotification(`Agora está a seguir ${user.name}!`, 'success');
        SystemLogger.log(`Agora está a seguir o utilizador "${user.name}"`);
      }
    } catch {
      window.appContext.notificationService.addNotification('Erro ao atualizar seguimento', 'warning');
      return;
    }
    
    // Update cache and DOM
    const newIsWatching = !isWatching;
    const newCount = (cached?.watcherCount || 0) + (newIsWatching ? 1 : -1);
    userExtraCache.set(userId, {
      ...(cached || { ratingAvg: 0, ratingCount: 0 }),
      watcherCount: Math.max(0, newCount),
      isWatching: newIsWatching
    } as UserExtraData);
    
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (userRow) {
      const watchButton = userRow.querySelector('button[data-watch-btn]');
      const watchCounter = userRow.querySelector('[data-watch-count]');
      if (watchButton) {
        watchButton.className = `${newIsWatching ? 'text-blue-600 font-bold' : 'text-slate-400'} cursor-pointer p-1.5 rounded-md`;
      }
      if (watchCounter) {
        watchCounter.textContent = String(Math.max(0, newCount));
      }
    }
  }
  // Toggles user favorite status
  async toggleUserFavorite(id: number): Promise<void> {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    const currentUserId = window.appContext.currentUserId;
    const isFavorite = window.favoriteUserIds.has(id);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await fetch(`${API_URL}/user-favorites/${currentUserId}/${id}`, { method: 'DELETE' });
        window.favoriteUserIds.delete(id);
        window.appContext.notificationService.addNotification(`${user.name} removido de favoritos!`, 'info');
        SystemLogger.log(`Utilizador "${user.name}" removido de favoritos`);
      } else {
        // Add to favorites
        await fetch(`${API_URL}/user-favorites/${currentUserId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorite_user_id: id })
        });
        window.favoriteUserIds.add(id);
        window.appContext.notificationService.addNotification(`${user.name} adicionado aos favoritos!`, 'success');
        SystemLogger.log(`Utilizador "${user.name}" adicionado aos favoritos`);
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      window.appContext.notificationService.addNotification('Erro ao atualizar favorito', 'warning');
    }
    
    window.appContext.saveAndRender();
  }

  // ===== VIP PRIORITY MANAGEMENT =====
  // Set VIP priority level for a user (0-4), saved to DB
  async setUserVIPLevel(userId: number, vipLevel: number): Promise<void> {
    const user = this.userService.getUserById(userId);
    if (!user) return;

    const level = parseInt(vipLevel.toString());
    if (level >= 0 && level <= 4) {
      // Save to DB via API
      await this.userService.updateUser(userId, { vip_level: level } as any);
      user.vip_level = level;
      
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
  getUserVIPLevel(userId: number): number {
    const user = this.userService.getUserById(userId);
    if (!user) return 0;
    return user.vip_level || 0;
  }

  // ===== RATING MANAGEMENT =====
  // Rate a user with a value 1-5, saved to DB
  async rateUser(userId: number, rating: number): Promise<void> {
    const user = this.userService.getUserById(userId);
    if (!user) return;

    if (rating < 1 || rating > 5) {
      window.appContext.notificationService.addNotification('Avaliação deve estar entre 1 e 5', 'warning');
      return;
    }

    try {
      await fetch(`${API_URL}/user-ratings/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rated_by: window.appContext.currentUserId, rating })
      });
      window.appContext.notificationService.addNotification(`Utilizador avaliado com ${rating} ⭐!`, 'success');
      SystemLogger.log(`Utilizador "${user.name}" avaliado com ${rating} estrelas`);
    } catch {
      window.appContext.notificationService.addNotification('Erro ao avaliar utilizador', 'warning');
    }
    
    // Refresh the modal with updated ratings
    this.showUserDetails(userId);
  }
}