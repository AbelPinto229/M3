// ===== ESTADO EM MEMÓRIA =====
const state = {
  users: [{ email: 'admin@sistema.com', role: 'ADMIN', active: true }],
  tasks: [],
  logs: [],
  comments: [],
  attachments: [],
  tags: [] // { taskId: number, tag: string }
};

const taskStatusCycle = ["Pendente", "Em Progresso", "Concluído"];
const taskPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
let pendingDeleteAction = null;
let commentIdCounter = 1;
let attachmentIdCounter = 1;
let activeTaskModalId = null;

// ===== AUTOMATION SERVICE =====
class AutomationService {
  applyRules(task) {
    if (task.type === 'bug') {
      const staff = state.users.filter(u => (u.role === 'ADMIN' || u.role === 'MANAGER') && u.active);
      if (staff.length > 0 && (!task.assigned || task.assigned.length === 0)) {
        const randomUser = staff[Math.floor(Math.random() * staff.length)];
        task.assigned = [randomUser.email];
        addLog(`Automação: Bug "${task.title}" atribuído a ${randomUser.email}`);
      }
      if (task.priority !== 'CRITICAL' && task.priority !== 'HIGH') {
        task.priority = 'HIGH';
        addLog(`Automação: Prioridade do Bug "${task.title}" elevada para HIGH`);
      }
    }
    if (task.deadline && task.status !== 'Concluído') {
      const today = new Date();
      const limit = new Date(task.deadline);
      const diffDays = Math.ceil((limit - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 2 && diffDays >= 0 && task.priority !== 'CRITICAL') {
        task.priority = 'CRITICAL';
        addLog(`Automação: Prazo curto para "${task.title}". Status -> CRITICAL`);
      }
    }
  }
}
const automationService = new AutomationService();

// ===== TAG SERVICE =====
class TagService {
  addTag(taskId, tag) {
    if (!tag.trim()) return;
    const exists = state.tags.some(t => t.taskId === taskId && t.tag.toLowerCase() === tag.toLowerCase());
    if (!exists) {
      state.tags.push({ taskId, tag: tag.toLowerCase() });
      addLog(`Tag "${tag}" adicionada.`);
    }
  }
  removeTag(taskId, tag) {
    state.tags = state.tags.filter(t => !(t.taskId === taskId && t.tag === tag));
    addLog(`Tag "${tag}" removida.`);
  }
  getTags(taskId) {
    return state.tags.filter(t => t.taskId === taskId).map(t => t.tag);
  }
}
const tagService = new TagService();

// ===== SEARCH SERVICE =====
class SearchService {
  filterTasks(tasks, criteria) {
    return tasks.filter(task => {
      const matchTitle = task.title.toLowerCase().includes(criteria.text.toLowerCase());
      const matchStatus = criteria.status === "" || task.status === criteria.status;
      const matchPriority = criteria.priority === "" || task.priority === criteria.priority;
      const matchType = criteria.type === "" || task.type === criteria.type;
      const taskTags = tagService.getTags(task.id);
      const matchTag = criteria.tag === "" || taskTags.some(t => t.includes(criteria.tag.toLowerCase()));
      return matchTitle && matchStatus && matchPriority && matchType && matchTag;
    });
  }
}
const searchService = new SearchService();

// ===== PRIORITY SERVICE =====
class PriorityService {
  setPriority(task, priority) { task.priority = priority; }
  getPriority(task) { return task.priority || "LOW"; }
  isHighPriority(task) { return task.priority === "HIGH" || task.priority === "CRITICAL"; }
}
const priorityService = new PriorityService();

// ===== MODAL DE CONFIRMAÇÃO =====
const openModal = (message, confirmCallback) => {
  const msgEl = document.getElementById('modalMessage');
  const modalEl = document.getElementById('confirmModal');
  if(msgEl) msgEl.innerText = message;
  if(modalEl) modalEl.classList.remove('hidden');
  pendingDeleteAction = confirmCallback;
};
window.closeModal = () => document.getElementById('confirmModal').classList.add('hidden');
document.getElementById('confirmBtn').onclick = () => { if (pendingDeleteAction) pendingDeleteAction(); closeModal(); };

// ===== DASHBOARD STATS =====
const updateDashboard = () => {
  const totalT = state.tasks.length;
  const completedT = state.tasks.filter(t => t.status === "Concluído").length;
  const pendingT = state.tasks.filter(t => t.status !== "Concluído").length;
  const rateT = totalT === 0 ? 0 : Math.round((completedT / totalT) * 100);
  const totalU = state.users.length;
  const activeU = state.users.filter(u => u.active).length;
  const rateU = totalU === 0 ? 0 : Math.round((activeU / totalU) * 100);

  document.getElementById('totalTasks').innerText = totalT;
  document.getElementById('pendingTasks').innerText = pendingT;
  document.getElementById('completionRate').innerText = `${rateT}%`;
  document.getElementById('taskProgressBar').style.width = `${rateT}%`;

  document.getElementById('totalUsers').innerText = totalU;
  document.getElementById('activeUsers').innerText = activeU;
  document.getElementById('userActiveRate').innerText = `${rateU}%`;
  document.getElementById('userProgressBar').style.width = `${rateU}%`;
};

// ===== LOGS E NOTIFICAÇÕES =====
const addLog = (message) => {
  const time = new Date().toLocaleTimeString();
  state.logs.unshift({ time, msg: message });
  const logContainer = document.getElementById('logs');
  if (logContainer) {
    logContainer.innerHTML = state.logs.slice(0, 20).map(log => `
      <div class="relative pl-2">
        <div class="absolute -left-[23px] top-1 w-3 h-3 bg-white border-2 border-slate-300 rounded-full z-10"></div>
        <p class="text-[10px] font-bold text-indigo-600 font-mono">${log.time}</p>
        <p class="text-[11px] text-slate-600 font-medium">${log.msg}</p>
      </div>`).join('');
  }
};

const addNotification = (message, type = 'success') => {
  const container = document.getElementById('notifications');
  if (!container) return;
  const colors = { 
    success: 'bg-white border-emerald-500 text-emerald-700 shadow-xl', 
    warning: 'bg-white border-red-500 text-red-700 shadow-xl', 
    info: 'bg-white border-indigo-500 text-indigo-700 shadow-xl' 
  };
  const notification = document.createElement('div');
  notification.className = `p-4 mb-3 border-l-4 rounded-xl text-xs font-bold transition-all duration-500 transform translate-x-0 pointer-events-auto relative z-[9999] border ${colors[type]}`;
  notification.innerHTML = message;
  container.prepend(notification);
  setTimeout(() => { 
    notification.style.opacity = '0'; 
    notification.style.transform = 'translateX(20px)'; 
    setTimeout(() => notification.remove(), 500); 
  }, 3000);
};

// ===== RENDER USERS E TASKS =====
const render = () => {
  const userSearchTerm = document.getElementById('searchUser').value.toLowerCase();
  const searchCriteria = {
    text: document.getElementById('searchTask').value,
    status: document.getElementById('filterStatus')?.value || "",
    priority: document.getElementById('filterPriority')?.value || "",
    type: document.getElementById('filterType')?.value || "",
    tag: document.getElementById('filterTag')?.value || ""
  };

  const roleColors = { 'ADMIN': 'text-red-500 bg-red-50 border-red-100', 'MANAGER': 'text-amber-600 bg-amber-50 border-amber-100', 'MEMBER': 'text-indigo-600 bg-indigo-50 border-indigo-100', 'VIEWER': 'text-slate-500 bg-slate-50 border-slate-100' };

  // Render users
  document.getElementById('userList').innerHTML = state.users
    .filter(u => u.email.toLowerCase().includes(userSearchTerm))
    .map((u, idx) => `
      <tr class="group hover:bg-slate-50 transition-colors">
        <td class="py-3 font-medium text-slate-700">${u.email} <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block mt-1 ${roleColors[u.role] || 'bg-slate-50'}">${u.role}</span></td>
        <td class="py-3 text-center">
          <button onclick="toggleUserStatus(${idx})" class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}">${u.active ? 'ATIVO' : 'INATIVO'}</button>
        </td>
        <td class="py-3 text-right">
          <button onclick="deleteUser(${idx})" class="text-slate-300 hover:text-red-500 transition-colors">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </td>
      </tr>`).join('');

  // Render tasks
  const filteredTasks = searchService.filterTasks(state.tasks, searchCriteria);
  document.getElementById('taskList').innerHTML = filteredTasks
    .map((t) => {
      const idx = state.tasks.findIndex(task => task.id === t.id);
      const statusColor = t.status === "Concluído" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : (t.status === "Em Progresso" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100");
      let priorityColorClass = t.priority === "MEDIUM" ? "text-amber-500 font-bold" : t.priority === "HIGH" ? "text-orange-500 font-bold" : t.priority === "CRITICAL" ? "text-red-600 font-bold" : "text-slate-400";

      return `
        <tr class="group hover:bg-slate-50 transition-colors border-b border-slate-100">
          <td class="py-4 px-2 cursor-pointer" onclick="openTaskModal(${t.id})">
            <p class="font-bold text-slate-700 ${t.status === 'Concluído' ? 'line-through opacity-40' : ''}">${t.title}</p>
            <span class="text-[8px] ${priorityColorClass} block uppercase tracking-tighter mt-1">${t.type} | ${t.priority || 'LOW'} ${t.deadline ? '| Expira: ' + t.deadline : ''}</span>
          </td>
          <td class="py-4 text-center align-middle">
            <button onclick="event.stopPropagation(); cycleTaskStatus(${idx})" class="text-[9px] font-bold px-3 py-1.5 rounded-md border min-w-[100px] inline-block ${statusColor}">${t.status.toUpperCase()}</button>
          </td>
          <td class="py-4 text-right pr-2">
            <div class="flex flex-row items-center justify-end gap-1 h-full">
              <select onchange="event.stopPropagation(); manualAssign(${idx}, this.value)" class="text-[10px] h-6 px-2 rounded-md border bg-white min-w-[100px]">
                <option value="">Atribuir...</option>
                ${state.users.filter(u => u.active).map(u => `<option value="${u.email}" ${t.assigned?.includes(u.email) ? 'selected' : ''}>${u.email.split('@')[0]}</option>`).join('')}
              </select>
              <select onchange="event.stopPropagation(); setTaskPriority(${idx}, this.value)" class="text-[10px] h-6 px-2 rounded-md border bg-white min-w-[70px]">
                ${taskPriorities.map(p => `<option value="${p}" ${t.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
              </select>
              <button onclick="event.stopPropagation(); editTaskTitle(${idx})" class="text-slate-300 hover:text-indigo-600 p-1.5 rounded-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
              <button onclick="event.stopPropagation(); deleteTask(${idx})" class="text-slate-300 hover:text-red-500 p-1.5 rounded-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
};

// ===== MODAL INTEGRADO (COMMENTS + ATTACHMENTS + TAGS) =====
window.openTaskModal = (taskId) => {
  activeTaskModalId = taskId;
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  const modalHtml = `
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
      <h3 class="font-bold mb-2">${task.title}</h3>
      <p class="text-[10px] text-slate-400 mb-4">Tipo: ${task.type} | Prioridade: ${task.priority || 'LOW'}</p>
      <div class="mb-4">
        <h4 class="font-bold text-xs mb-1">Tags:</h4>
        <div id="taskTagsList" class="flex flex-wrap gap-1 mb-2"></div>
        <input type="text" id="tagInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Nova tag..." onkeypress="if(event.key==='Enter'){ addTagToTask(); }">
      </div>
      <div id="taskComments" class="max-h-32 overflow-y-auto mb-2 border-t pt-2"></div>
      <input type="text" id="newCommentInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Comentar..." onkeypress="if(event.key==='Enter'){ addCommentModal(); }">
      <div class="mt-4">
        <h4 class="font-bold text-xs mb-1">Anexos:</h4>
        <div id="taskAttachments" class="max-h-24 overflow-y-auto"></div>
        <input type="file" id="newAttachmentInput" class="mt-1 text-xs" onchange="addAttachmentModal(event)">
      </div>
      <div class="flex justify-end mt-4"><button onclick="closeTaskModal()" class="px-4 py-2 bg-gray-200 rounded text-xs">Fechar</button></div>
    </div>`;

  const container = document.createElement('div');
  container.id = 'taskModalContainer';
  container.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50';
  container.innerHTML = modalHtml;
  document.body.appendChild(container);
  renderTaskModal();
};

window.renderTaskModal = () => {
  if (!activeTaskModalId) return;
  const tagsList = document.getElementById('taskTagsList');
  if (tagsList) tagsList.innerHTML = tagService.getTags(activeTaskModalId).map(tag => `<span class="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center">#${tag} <button onclick="removeTagFromTask('${tag}')" class="ml-1 text-red-400">×</button></span>`).join('');
  const commentsContainer = document.getElementById('taskComments');
  if (commentsContainer) commentsContainer.innerHTML = state.comments.filter(c => c.taskId === activeTaskModalId).map(c => `<div class="flex justify-between text-[10px] mb-1"><span><b>${c.userEmail}:</b> ${c.message}</span><button onclick="deleteComment(${c.id})" class="text-red-500">×</button></div>`).join('');
  const attachmentsContainer = document.getElementById('taskAttachments');
  if (attachmentsContainer) attachmentsContainer.innerHTML = state.attachments.filter(a => a.taskId === activeTaskModalId).map(a => `<div class="flex justify-between text-[10px] mb-1"><a href="${a.content}" download="${a.filename}" class="text-blue-600 underline">${a.filename}</a><button onclick="deleteAttachment(${a.id})" class="text-red-500">×</button></div>`).join('');
};

window.closeTaskModal = () => { const modal = document.getElementById('taskModalContainer'); if (modal) modal.remove(); activeTaskModalId = null; };

// ===== ACTIONS: TAGS, COMMENTS, ATTACHMENTS =====
window.addTagToTask = () => { const input = document.getElementById('tagInput'); tagService.addTag(activeTaskModalId, input.value); input.value = ''; renderTaskModal(); render(); };
window.removeTagFromTask = (tag) => { tagService.removeTag(activeTaskModalId, tag); renderTaskModal(); render(); };
window.addCommentModal = () => { const input = document.getElementById('newCommentInput'); if (!input.value.trim()) return; state.comments.push({ id: commentIdCounter++, taskId: activeTaskModalId, userEmail: 'admin@sistema.com', message: input.value }); addLog(`Novo comentário na tarefa #${activeTaskModalId}`); input.value = ''; renderTaskModal(); };
window.deleteComment = (id) => { state.comments = state.comments.filter(c => c.id !== id); renderTaskModal(); };
window.addAttachmentModal = (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (e) => { state.attachments.push({ id: attachmentIdCounter++, taskId: activeTaskModalId, filename: file.name, content: e.target.result }); addLog(`Anexo "${file.name}" carregado.`); renderTaskModal(); }; reader.readAsDataURL(file); };
window.deleteAttachment = (id) => { state.attachments = state.attachments.filter(a => a.id !== id); renderTaskModal(); };

// ===== ACÇÕES GERAIS =====
const saveAndRender = () => { render(); updateDashboard(); };
window.toggleUserStatus = (i) => { state.users[i].active = !state.users[i].active; addLog(`User ${state.users[i].email} -> ${state.users[i].active ? 'ATIVO' : 'INATIVO'}`); saveAndRender(); };
window.cycleTaskStatus = (i) => { 
  const old = state.tasks[i].status;
  state.tasks[i].status = taskStatusCycle[(taskStatusCycle.indexOf(old) + 1) % taskStatusCycle.length]; 
  addLog(`Status "${state.tasks[i].title}": ${old} -> ${state.tasks[i].status}`);
  automationService.applyRules(state.tasks[i]); // Re-checar regras
  saveAndRender(); 
};
window.deleteUser = (i) => openModal(`Eliminar ${state.users[i].email}?`, () => { state.users.splice(i, 1); saveAndRender(); });
window.deleteTask = (i) => {
  const taskId = state.tasks[i].id;
  openModal(`Remover tarefa?`, () => {
    state.tasks.splice(i, 1);
    state.comments = state.comments.filter(c => c.taskId !== taskId);
    state.attachments = state.attachments.filter(a => a.taskId !== taskId);
    state.tags = state.tags.filter(t => t.taskId !== taskId);
    saveAndRender();
  });
};
window.manualAssign = (idx, email) => { 
  state.tasks[idx].assigned = email ? [email] : []; 
  if(email) addLog(`Tarefa "${state.tasks[idx].title}" atribuída a ${email}`);
  saveAndRender(); 
};
window.setTaskPriority = (idx, p) => { 
  state.tasks[idx].priority = p; 
  addLog(`Tarefa "${state.tasks[idx].title}" prioridade -> ${p}`);
  saveAndRender(); 
};
window.editTaskTitle = (idx) => {
  const task = state.tasks[idx];
  if (!task) return;

  // Se já existir, não duplica
  if (document.getElementById('editTitleModal')) return;

  const modal = document.createElement('div');
  modal.id = 'editTitleModal';
  modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]';

  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
      <h3 class="font-bold text-lg mb-3">Editar nome da tarefa</h3>
      <input id="editTitleInput" class="w-full border rounded px-3 py-2 mb-4 text-sm" value="${task.title}">
      <div class="flex justify-end gap-2">
        <button onclick="closeEditTitleModal()" class="px-4 py-2 bg-gray-200 rounded text-sm">Cancelar</button>
        <button onclick="saveEditTitleModal(${idx})" class="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Salvar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    document.getElementById('editTitleInput')?.focus();
  }, 50);
};
window.closeEditTitleModal = () => {
  const modal = document.getElementById('editTitleModal');
  if (modal) modal.remove();
};

window.saveEditTitleModal = (idx) => {
  const input = document.getElementById('editTitleInput');
  if (!input) return;

  const newTitle = input.value.trim();
  if (!newTitle) return;

  const oldTitle = state.tasks[idx].title;
  state.tasks[idx].title = newTitle;

  addLog(`Título alterado: "${oldTitle}" -> "${newTitle}"`);
  closeEditTitleModal();
  saveAndRender();
};


// ===== FORMS E FILTROS =====
document.getElementById('userForm').onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('userEmail').value;
  if(state.users.some(u => u.email === email)) { addNotification("Email já existe!", "warning"); return; }
  state.users.push({ email: email, role: document.getElementById('userRole').value, active: true });
  addLog(`Novo user: ${email}`);
  addNotification("Utilizador adicionado!");
  e.target.reset();
  saveAndRender();
};

document.getElementById('taskForm').onsubmit = (e) => {
  e.preventDefault();
  const newTask = { id: Date.now(), title: document.getElementById('taskTitle').value, type: document.getElementById('taskType').value, status: "Pendente", priority: "LOW", deadline: document.getElementById('taskDeadline').value || null, assigned: [] };
  automationService.applyRules(newTask); // Automação na criação
  state.tasks.push(newTask);
  addLog(`Nova tarefa: "${newTask.title}"`);
  addNotification("Tarefa criada!");
  e.target.reset();
  saveAndRender();
};

['searchUser', 'searchTask', 'filterStatus', 'filterPriority', 'filterType', 'filterTag'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', render);
  document.getElementById(id)?.addEventListener('change', render);
});

saveAndRender();