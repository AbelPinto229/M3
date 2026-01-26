const state = {
  users: JSON.parse(localStorage.getItem('users')) || [{ email: 'admin@sistema.com', role: 'ADMIN', active: true }],
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  logs: []
};

const taskStatusCycle = ["Pendente", "Em Progresso", "Concluído"];
let pendingDeleteAction = null;

// Lógica de Modal
const openModal = (message, confirmCallback) => {
  document.getElementById('modalMessage').innerText = message;
  document.getElementById('confirmModal').classList.remove('hidden');
  pendingDeleteAction = confirmCallback;
};
window.closeModal = () => document.getElementById('confirmModal').classList.add('hidden');
document.getElementById('confirmBtn').onclick = () => { if (pendingDeleteAction) pendingDeleteAction(); closeModal(); };

// Dashboard Stats
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

// Logs e Notificações
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

// RENDER COM FILTRO E CORES DE ROLE
const render = () => {
  const userSearchTerm = document.getElementById('searchUser').value.toLowerCase();
  const taskSearchTerm = document.getElementById('searchTask').value.toLowerCase();

  const roleColors = {
    'ADMIN': 'text-red-500 bg-red-50 border-red-100',
    'MANAGER': 'text-amber-600 bg-amber-50 border-amber-100',
    'MEMBER': 'text-indigo-600 bg-indigo-50 border-indigo-100',
    'VIEWER': 'text-slate-500 bg-slate-50 border-slate-100'
  };

  // Render Utilizadores
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

  // Render Tarefas
  document.getElementById('taskList').innerHTML = state.tasks
    .filter(t => t.title.toLowerCase().includes(taskSearchTerm))
    .map((t) => {
      const statusColor = t.status === "Concluído" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : (t.status === "Em Progresso" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100");
      return `
      <tr class="group hover:bg-slate-50 transition-colors">
        <td class="py-3 font-medium text-slate-700 ${t.status === 'Concluído' ? 'line-through opacity-40' : ''}">${t.title}<span class="text-[8px] font-bold text-slate-400 block uppercase tracking-tighter">${t.type}</span></td>
        <td class="py-3 text-center">
          <button onclick="cycleTaskStatus(${state.tasks.indexOf(t)})" class="text-[9px] font-bold px-2 py-1 rounded-md border ${statusColor}">${t.status.toUpperCase()}</button>
        </td>
        <td class="py-3 text-right">
          <button onclick="deleteTask(${state.tasks.indexOf(t)})" class="text-slate-300 hover:text-red-500 transition-colors">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </td>
      </tr>`;
    }).join('');
};

const saveAndRender = () => {
  localStorage.setItem('users', JSON.stringify(state.users));
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
  render();
  updateDashboard();
};

// Filtros em Tempo Real
document.getElementById('searchUser').addEventListener('input', render);
document.getElementById('searchTask').addEventListener('input', render);

// Ações
window.toggleUserStatus = (i) => { state.users[i].active = !state.users[i].active; addLog(`Acesso: ${state.users[i].email} (${state.users[i].active ? 'ON' : 'OFF'})`); saveAndRender(); };
window.cycleTaskStatus = (i) => { state.tasks[i].status = taskStatusCycle[(taskStatusCycle.indexOf(state.tasks[i].status) + 1) % taskStatusCycle.length]; addLog(`Tarefa: ${state.tasks[i].title} -> ${state.tasks[i].status}`); saveAndRender(); };
window.deleteUser = (i) => openModal(`Eliminar ${state.users[i].email}?`, () => { addLog(`Removido: ${state.users[i].email}`); state.users.splice(i, 1); addNotification("Utilizador removido", "warning"); saveAndRender(); });
window.deleteTask = (i) => openModal(`Remover ${state.tasks[i].title}?`, () => { addLog(`Removida: ${state.tasks[i].title}`); state.tasks.splice(i, 1); addNotification("Tarefa removida", "info"); saveAndRender(); });

// Forms
document.getElementById('userForm').onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('userEmail').value;
  if (state.users.some(u => u.email === email)) return addNotification("Email já existe", "warning");
  state.users.push({ email, role: document.getElementById('userRole').value, active: true });
  addNotification("Utilizador criado");
  addLog(`Novo User: ${email}`);
  saveAndRender(); e.target.reset();
};

document.getElementById('taskForm').onsubmit = (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  state.tasks.push({ title, type: document.getElementById('taskType').value, status: "Pendente" });
  addNotification("Tarefa adicionada");
  addLog(`Nova Tarefa: ${title}`);
  saveAndRender(); e.target.reset();
};

// Start
saveAndRender();