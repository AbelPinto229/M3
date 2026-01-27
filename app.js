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

// ===== SEARCH SERVICE (AVANÇADO) =====
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

// ===== FUNÇÃO DE MODAL DE CONFIRMAÇÃO =====
const openModal = (message, confirmCallback) => {
  document.getElementById('modalMessage').innerText = message;
  document.getElementById('confirmModal').classList.remove('hidden');
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

// ===== AUTOMATION BUGS =====
const applyAutomation = (task) => {
  if (task.type === 'bug') {
    const candidates = state.users.filter(u => (u.role === 'ADMIN' || u.role === 'MANAGER') && u.active);
    if (candidates.length > 0) {
      const randomUser = candidates[Math.floor(Math.random() * candidates.length)];
      task.assigned = [randomUser.email];
      addLog(`Automação: "${task.title}" atribuída a ${randomUser.email}`);
    } else {
      task.assigned = [];
    }
  } else {
    task.assigned = [];
  }
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

  const roleColors = {
    'ADMIN': 'text-red-500 bg-red-50 border-red-100',
    'MANAGER': 'text-amber-600 bg-amber-50 border-amber-100',
    'MEMBER': 'text-indigo-600 bg-indigo-50 border-indigo-100',
    'VIEWER': 'text-slate-500 bg-slate-50 border-slate-100'
  };

  // Render Users
  document.getElementById('userList').innerHTML = state.users
    .filter(u => u.email.toLowerCase().includes(userSearchTerm))
    .map((u) => `
      <tr class="group hover:bg-slate-50 transition-colors">
        <td class="py-3 font-medium text-slate-700">
          ${u.email} 
          <span class="text-[8px] px-1.5 py-0.5 rounded border font-black inline-block mt-1 ${roleColors[u.role] || 'bg-slate-50'}">${u.role}</span>
        </td>
        <td class="py-3 text-center">
          <button onclick="toggleUserStatus(${state.users.indexOf(u)})" class="text-[9px] font-bold px-2 py-1 rounded-full border ${u.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}">${u.active ? 'ATIVO' : 'INATIVO'}</button>
        </td>
        <td class="py-3 text-right">
          <button onclick="deleteUser(${state.users.indexOf(u)})" class="text-slate-300 hover:text-red-500 transition-colors">
              <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </td>
      </tr>`).join('');

  // Render Tasks Filtradas
  const filteredTasks = searchService.filterTasks(state.tasks, searchCriteria);

  document.getElementById('taskList').innerHTML = filteredTasks
    .map((t) => {
      const statusColor = t.status === "Concluído" ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : (t.status === "Em Progresso" ? "bg-amber-50 text-amber-600 border-amber-100" 
                          : "bg-blue-50 text-blue-600 border-blue-100");
      const assignedText = t.assigned && t.assigned.length ? ` - Atribuído a: ${t.assigned.join(', ')}` : '';
      const deadlineText = t.deadline ? ` | Deadline: ${t.deadline}` : '';
      const taskTags = tagService.getTags(t.id).map(tag => `<span class="bg-slate-100 text-slate-500 px-1 rounded mr-1">#${tag}</span>`).join('');

      let priorityColorClass = "text-slate-400";
      switch(t.priority) {
        case "MEDIUM": priorityColorClass = "text-amber-500 font-bold"; break; // Amarelo
        case "HIGH": priorityColorClass = "text-orange-500 font-bold"; break; // Laranja
        case "CRITICAL": priorityColorClass = "text-red-600 font-bold"; break; // Vermelho
      }

      return `
        <tr class="group hover:bg-slate-50 transition-colors">
          <td class="py-3 font-medium text-slate-700 cursor-pointer ${t.status === 'Concluído' ? 'line-through opacity-40' : ''}" 
              onclick="openTaskModal(${t.id})">
            ${t.title} 
            <span class="text-[8px] ${priorityColorClass} block uppercase tracking-tighter">
              ${t.type} | ${t.priority || 'LOW'}${assignedText}${deadlineText}
            </span>
            <div class="mt-1">${taskTags}</div>
          </td>
          <td class="py-3 text-center">
            <button onclick="event.stopPropagation(); cycleTaskStatus(${state.tasks.findIndex(task => task.id === t.id)})" class="text-[9px] font-bold px-2 py-1 rounded-md border ${statusColor}">${t.status.toUpperCase()}</button>
          </td>
          <td class="py-3 text-right flex items-center gap-2 justify-end">
            <select onchange="event.stopPropagation(); manualAssign(${state.tasks.findIndex(task => task.id === t.id)}, this.value)" class="text-[9px] px-2 py-1 rounded-md border bg-white">
              <option value="">Atribuir...</option>
              ${state.users.filter(u => u.active).map(u => `<option value="${u.email}" ${t.assigned?.includes(u.email) ? 'selected' : ''}>${u.email}</option>`).join('')}
            </select>
            <select onchange="event.stopPropagation(); setTaskPriority(${state.tasks.findIndex(task => task.id === t.id)}, this.value)" class="text-[9px] px-2 py-1 rounded-md border bg-white">
              ${taskPriorities.map(p => `<option value="${p}" ${t.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
            <button onclick="event.stopPropagation(); deleteTask(${state.tasks.findIndex(task => task.id === t.id)})" class="text-slate-300 hover:text-red-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
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
        <input type="text" id="tagInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Nova tag... (Enter)" onkeypress="if(event.key==='Enter'){ addTagToTask(); }">
      </div>

      <div id="taskComments" class="max-h-32 overflow-y-auto mb-2 border-t pt-2"></div>
      <input type="text" id="newCommentInput" class="w-full px-2 py-1 border rounded text-[10px]" placeholder="Comentar..." onkeypress="if(event.key==='Enter'){ addCommentModal(); }">

      <div class="mt-4">
        <h4 class="font-bold text-xs mb-1">Anexos:</h4>
        <div id="taskAttachments" class="max-h-24 overflow-y-auto"></div>
        <input type="file" id="newAttachmentInput" class="mt-1 text-xs" onchange="addAttachmentModal(event)">
      </div>

      <div class="flex justify-end mt-4">
        <button onclick="closeTaskModal()" class="px-4 py-2 bg-gray-200 rounded text-xs">Fechar</button>
      </div>
    </div>
  `;

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
  if (tagsList) {
    tagsList.innerHTML = tagService.getTags(activeTaskModalId)
      .map(tag => `<span class="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center">#${tag} <button onclick="removeTagFromTask('${tag}')" class="ml-1 text-red-400">×</button></span>`).join('');
  }

  const commentsContainer = document.getElementById('taskComments');
  if (commentsContainer) {
    commentsContainer.innerHTML = state.comments
      .filter(c => c.taskId === activeTaskModalId)
      .map(c => `<div class="flex justify-between text-[10px] mb-1"><span><b>${c.userEmail}:</b> ${c.message}</span><button onclick="deleteComment(${c.id})" class="text-red-500">×</button></div>`).join('');
  }

  const attachmentsContainer = document.getElementById('taskAttachments');
  if (attachmentsContainer) {
    attachmentsContainer.innerHTML = state.attachments
      .filter(a => a.taskId === activeTaskModalId)
      .map(a => `<div class="flex justify-between text-[10px] mb-1"><a href="${a.content}" download="${a.filename}" class="text-blue-600 underline">${a.filename}</a><button onclick="deleteAttachment(${a.id})" class="text-red-500">×</button></div>`).join('');
  }
};

window.closeTaskModal = () => {
  const modal = document.getElementById('taskModalContainer');
  if (modal) modal.remove();
  activeTaskModalId = null;
};

// ===== ACTIONS: TAGS, COMMENTS, ATTACHMENTS =====
window.addTagToTask = () => {
  const input = document.getElementById('tagInput');
  tagService.addTag(activeTaskModalId, input.value);
  input.value = '';
  renderTaskModal();
  render();
};
window.removeTagFromTask = (tag) => {
  tagService.removeTag(activeTaskModalId, tag);
  renderTaskModal();
  render();
};
window.addCommentModal = () => {
  const input = document.getElementById('newCommentInput');
  if (!input.value.trim()) return;
  state.comments.push({ id: commentIdCounter++, taskId: activeTaskModalId, userEmail: 'admin@sistema.com', message: input.value });
  input.value = '';
  renderTaskModal();
};
window.deleteComment = (id) => {
  state.comments = state.comments.filter(c => c.id !== id);
  renderTaskModal();
};
window.addAttachmentModal = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.attachments.push({ id: attachmentIdCounter++, taskId: activeTaskModalId, filename: file.name, content: e.target.result });
    renderTaskModal();
  };
  reader.readAsDataURL(file);
};
window.deleteAttachment = (id) => {
  state.attachments = state.attachments.filter(a => a.id !== id);
  renderTaskModal();
};

// ===== ACÇÕES GERAIS =====
const saveAndRender = () => { render(); updateDashboard(); };

window.toggleUserStatus = (i) => { state.users[i].active = !state.users[i].active; saveAndRender(); };
window.cycleTaskStatus = (i) => { 
  state.tasks[i].status = taskStatusCycle[(taskStatusCycle.indexOf(state.tasks[i].status) + 1) % taskStatusCycle.length]; 
  saveAndRender(); 
};
window.deleteUser = (i) => openModal(`Eliminar ${state.users[i].email}?`, () => { state.users.splice(i, 1); saveAndRender(); });
window.deleteTask = (i) => openModal(`Remover tarefa?`, () => {
  const taskId = state.tasks[i].id;
  state.tasks.splice(i, 1);
  state.comments = state.comments.filter(c => c.taskId !== taskId);
  state.attachments = state.attachments.filter(a => a.taskId !== taskId);
  state.tags = state.tags.filter(t => t.taskId !== taskId);
  saveAndRender();
});

window.manualAssign = (taskIndex, email) => {
  if (!state.tasks[taskIndex].assigned) state.tasks[taskIndex].assigned = [];
  if (email && !state.tasks[taskIndex].assigned.includes(email)) state.tasks[taskIndex].assigned.push(email);
  saveAndRender();
};
window.setTaskPriority = (taskIndex, p) => { state.tasks[taskIndex].priority = p; saveAndRender(); };

// ===== FORMS E FILTROS =====
document.getElementById('userForm').onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('userEmail').value;
  if(state.users.some(u => u.email === email)) {
      addNotification("Email já existe!", "warning");
      return;
  }
  state.users.push({ email: email, role: document.getElementById('userRole').value, active: true });
  addNotification("Utilizador adicionado com sucesso!");
  e.target.reset();
  saveAndRender();
};

document.getElementById('taskForm').onsubmit = (e) => {
  e.preventDefault();
  const newTask = { 
    id: Date.now(), 
    title: document.getElementById('taskTitle').value, 
    type: document.getElementById('taskType').value, 
    status: "Pendente", 
    priority: "LOW",
    deadline: document.getElementById('taskDeadline').value || null 
  };
  applyAutomation(newTask);
  state.tasks.push(newTask);
  addNotification("Tarefa criada com sucesso!");
  e.target.reset();
  saveAndRender();
};

['searchUser', 'searchTask', 'filterStatus', 'filterPriority', 'filterType', 'filterTag'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', render);
  document.getElementById(id)?.addEventListener('change', render);
});

saveAndRender();