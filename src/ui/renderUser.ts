// ===== USER RENDERER - All user-related rendering =====

import { UserService } from '../services/UserService.js';

export class RenderUser {
  constructor(private userService: UserService) {}

  // Renders user list table with search and filter functionality
  render(): void {
    // Get search term and apply active/inactive filter
    const userSearchTerm = (document.getElementById('searchUser') as HTMLInputElement)?.value.toLowerCase() || '';
    const userFilter = (window as any).userFilter || 'all';
    const userList = document.getElementById('userList');
    if (!userList) return;

    // Define Tailwind color classes for each user role
    const roleColors: Record<string, string> = {
      ADMIN: 'text-red-500 bg-red-50 border-red-100',
      MANAGER: 'text-amber-600 bg-amber-50 border-amber-100',
      MEMBER: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      VIEWER: 'text-slate-500 bg-slate-50 border-slate-100',
    };

    // Filter users by name or email, then by active status if selected
    let filteredUsers = this.userService
      .getUsers()
      .filter(u => u.email.toLowerCase().includes(userSearchTerm) || u.name.toLowerCase().includes(userSearchTerm));
    
    if (userFilter === 'active') {
      filteredUsers = filteredUsers.filter(u => u.active);
    } else if (userFilter === 'inactive') {
      filteredUsers = filteredUsers.filter(u => !u.active);
    }

    userList.innerHTML = filteredUsers
      .map(
        (u) => {
          // Check permissions for toggle and delete actions
          const canToggle = (window as any).checkPermission?.('toggle_user');
          const canDelete = (window as any).checkPermission?.('delete_user');
          // Use user photo if available, otherwise show initial avatar
          const photoHTML = u.photo ? `<img src="${u.photo}" alt="${u.name}" class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200">` : `<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">${u.name.charAt(0).toUpperCase()}</div>`;
          
          return `
      <tr class="group hover:bg-slate-50 transition-colors cursor-pointer" onclick="window.renderUser.showUserDetails(${u.id})">
        <td class="py-3 font-medium text-slate-700 flex items-center gap-3">
          ${photoHTML}
          <span>${u.name} <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block ml-1 ${roleColors[u.role] || 'bg-slate-50'}">${u.role}</span></span>
        </td>
        <td class="py-3 text-center" onclick="event.stopPropagation()">
          <button ${canToggle ? '' : 'disabled'} onclick="${canToggle ? `window.renderUser.toggleUserStatus(${u.id})` : 'return false'}" class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'} ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}">${u.active ? 'ACTIVE' : 'INACTIVE'}</button>
        </td>
        <td class="py-3 text-right" onclick="event.stopPropagation()">
          <button ${(window as any).checkPermission?.('edit_user') ? '' : 'disabled'} onclick="${(window as any).checkPermission?.('edit_user') ? `window.renderUser.editUser(${u.id})` : 'return false'}" class="text-slate-300 hover:text-indigo-600 transition-colors ${!(window as any).checkPermission?.('edit_user') ? 'opacity-50 cursor-not-allowed' : ''} mr-2">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <button ${canDelete ? '' : 'disabled'} onclick="${canDelete ? `window.renderUser.deleteUser(${u.id})` : 'return false'}" class="text-slate-300 hover:text-red-500 transition-colors ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </td>
      </tr>`;
        }
      )
      .join('');
  }

  // ===== USER ACTIONS =====
  // Toggles user active/inactive status
  toggleUserStatus(id: number): void {
    this.userService.toggleUserStatus(id);
    (window as any).saveAndRender();
  }

  // Opens confirmation modal to delete user
  deleteUser(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    // Trigger confirmation modal
    window.renderModals.openConfirmModal(`Delete ${user.email}?`, () => {
      this.userService.deleteUser(id);
      (window as any).saveAndRender();
    });
  }

  // Displays detailed user information in a modal
  showUserDetails(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    // Use user photo or generate avatar with user initial
    const photoHTML = user.photo ? `<img src="${user.photo}" alt="${user.name}" class="w-20 h-20 rounded-full object-cover border-2 border-slate-200 mx-auto mb-4">` : `<div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">${user.name.charAt(0).toUpperCase()}</div>`;
    
    const detailsContent = `
      <div class="space-y-4">
        ${photoHTML}
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-bold text-slate-600">ID</p>
            <p class="text-lg font-semibold text-slate-900">${user.id}</p>
          </div>
          <div>
            <p class="text-sm font-bold text-slate-600">ROLE</p>
            <p class="text-lg font-semibold text-slate-900">${user.role}</p>
          </div>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-600">NAME</p>
          <p class="text-lg font-semibold text-slate-900">${user.name}</p>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-600">EMAIL</p>
          <p class="text-lg font-semibold text-slate-900">${user.email}</p>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-600">STATUS</p>
          <p class="text-lg font-semibold ${user.active ? 'text-emerald-600' : 'text-slate-400'}">${user.active ? 'ACTIVE' : 'INACTIVE'}</p>
        </div>
      </div>
    `;
    
    window.renderModals.openModal(`Details of ${user.name}`, detailsContent);
  }

  // Opens modal to edit user information (name, email, role, photo)
  editUser(id: number): void {
    const user = this.userService.getUserById(id);
    if (!user) return;
    
    window.renderModals.openEditUserModal(id, user);
  }
}
