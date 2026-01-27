// ===== ESTADO EM MEMÓRIA =====
const state = {
  users: [{ email: 'admin@sistema.com', role: 'ADMIN', active: true }],
  tasks: [],
  logs: []
};

const taskStatusCycle = ["Pendente", "Em Progresso", "Concluído"];
let pendingDeleteAction = null;

// ===== FUNÇÃO DE MODAL =====
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
  const colors = { 
    success: 'bg-white border-emerald-500 text-emerald-700', 
    warning: 'bg-white border-red-500 text-red-700', 
    info: 'bg-white border-indigo-500 text-indigo-700' 
  };
  const notification = document.createElement('div');
  notification.className = `p-4 mb-3 border-l-4 rounded-xl shadow-lg text-xs font-bold transition-all pointer-events-auto ${colors[type]}`;
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

// ===== DEADLINE HELPERS =====
const isExpired = (task) => {
  if (!task.deadline) return false;
  return new Date(task.deadline).getTime() < Date.now();
};

// ===== RENDER USERS E TASKS =====
const render = () => {
  const userSearchTerm = document.getElementById('searchUser').value.toLowerCase();
  const taskSearchTerm = document.getElementById('searchTask').value.toLowerCase();

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

  // Render Tasks
  document.getElementById('taskList').innerHTML = state.tasks
    .filter(t => t.title.toLowerCase().includes(taskSearchTerm))
    .map((t) => {
      const statusColor = t.status === "Concluído" ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : (t.status === "Em Progresso" ? "bg-amber-50 text-amber-600 border-amber-100" 
                          : "bg-blue-50 text-blue-600 border-blue-100");
      const assignedText = t.assigned && t.assigned.length ? ` - Atribuído a: ${t.assigned.join(', ')}` : '';
      const expiredClass = isExpired(t) ? 'line-through text-red-600 opacity-50' : '';
      const deadlineText = t.deadline ? `<span class="text-[8px] font-mono text-slate-400 block">Deadline: ${new Date(t.deadline).toLocaleDateString()}</span>` : '';

      return `
      <tr class="group hover:bg-slate-50 transition-colors">
        <td class="py-3 font-medium text-slate-700 ${t.status === 'Concluído' ? 'line-through opacity-40' : ''} ${expiredClass}">
          ${t.title} <span class="text-[8px] font-bold text-slate-400 block uppercase tracking-tighter">${t.type}${assignedText}</span>
          ${deadlineText}
        </td>
        <td class="py-3 text-center">
          <button onclick="cycleTaskStatus(${state.tasks.indexOf(t)})" class="text-[9px] font-bold px-2 py-1 rounded-md border ${statusColor}">${t.status.toUpperCase()}</button>
        </td>
        <td class="py-3 text-right flex items-center gap-2 justify-end">
          <!-- Dropdown para atribuição manual -->
          <select onchange="manualAssign(${state.tasks.indexOf(t)}, this.value)" class="text-[9px] px-2 py-1 rounded-md border bg-white">
            <option value="">Atribuir a...</option>
            ${state.users.filter(u => u.active).map(u => `<option value="${u.email}" ${t.assigned && t.assigned.includes(u.email) ? 'selected' : ''}>${u.email}</option>`).join('')}
          </select>
          <!-- Botão vermelho para remover atribuição -->
          <button onclick="removeAssignment(${state.tasks.indexOf(t)})" class="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700">x</button>
          <!-- Botão icone de lixo para deletar task -->
          <button onclick="deleteTask(${state.tasks.indexOf(t)})" class="text-slate-300 hover:text-red-500">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </td>
      </tr>`;
    }).join('');
};

// ===== SAVE & RENDER =====
const saveAndRender = () => {
  render();
  updateDashboard();
};

// ===== FILTROS =====
document.getElementById('searchUser').addEventListener('input', render);
document.getElementById('searchTask').addEventListener('input', render);

// ===== AÇÕES =====
window.toggleUserStatus = (i) => { 
  state.users[i].active = !state.users[i].active; 
  addLog(`Acesso: ${state.users[i].email} (${state.users[i].active ? 'ON' : 'OFF'})`); 
  saveAndRender(); 
};
window.cycleTaskStatus = (i) => { 
  state.tasks[i].status = taskStatusCycle[(taskStatusCycle.indexOf(state.tasks[i].status) + 1) % taskStatusCycle.length]; 
  addLog(`Tarefa: ${state.tasks[i].title} -> ${state.tasks[i].status}`); 
  saveAndRender(); 
};
window.deleteUser = (i) => openModal(`Eliminar ${state.users[i].email}?`, () => { 
  addLog(`Removido: ${state.users[i].email}`); 
  state.users.splice(i, 1); 
  addNotification("Utilizador removido", "warning"); 
  saveAndRender(); 
});
window.deleteTask = (i) => openModal(`Remover ${state.tasks[i].title}?`, () => { 
  addLog(`Removida: ${state.tasks[i].title}`); 
  state.tasks.splice(i, 1); 
  addNotification("Tarefa removida", "info"); 
  saveAndRender(); 
});

// ===== MANUAL ASSIGNMENT =====
window.manualAssign = (taskIndex, userEmail) => {
  const task = state.tasks[taskIndex];
  if (!task.assigned) task.assigned = [];
  if (userEmail && !task.assigned.includes(userEmail)) {
    task.assigned.push(userEmail);
    addLog(`Tarefa: "${task.title}" atribuída manualmente a ${userEmail}`);
  }
  saveAndRender();
};

window.removeAssignment = (taskIndex) => {
  const task = state.tasks[taskIndex];
  if (!task.assigned) return;
  task.assigned = [];
  addLog(`Tarefa: "${task.title}" não tem nenhum utilizador atribuído`);
  saveAndRender();
};

// ===== FORMS =====
document.getElementById('userForm').onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('userEmail').value;
  if (state.users.some(u => u.email === email)) return addNotification("Email já existe", "warning");
  state.users.push({ email, role: document.getElementById('userRole').value, active: true });
  addNotification("Utilizador criado");
  addLog(`Novo User: ${email}`);
  saveAndRender(); 
  e.target.reset();
};

document.getElementById('taskForm').onsubmit = (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const type = document.getElementById('taskType').value; // 'bug', 'feature', 'task'
  const deadlineInput = document.getElementById('taskDeadline')?.value;

  const newTask = { title, type, status: "Pendente", assigned: [] };
  if (deadlineInput) newTask.deadline = new Date(deadlineInput);

  applyAutomation(newTask); // aplica automação se for bug
  state.tasks.push(newTask);

  addNotification("Tarefa adicionada");
  addLog(`Nova Tarefa: ${title}`);
  saveAndRender(); 
  e.target.reset();
};

// ===== START =====
saveAndRender();
