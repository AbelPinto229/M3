/**
 * ESTADO GLOBAL E PERSISTÊNCIA
 */
const state = {
  users: JSON.parse(localStorage.getItem('users')) || [
    { email: 'admin@sistema.com', role: 'ADMIN', active: true }
  ],
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  logs: []
};

const taskStatusCycle = ["Pendente", "Em Progresso", "Concluído"];

// Variável global para armazenar a ação de confirmação do modal
let pendingDeleteAction = null;

/**
 * LÓGICA DO MODAL DE CONFIRMAÇÃO
 */
const openModal = (message, confirmCallback) => {
  const modal = document.getElementById('confirmModal');
  document.getElementById('modalMessage').innerText = message;
  modal.classList.remove('hidden');
  pendingDeleteAction = confirmCallback;
};

window.closeModal = () => {
  document.getElementById('confirmModal').classList.add('hidden');
  pendingDeleteAction = null;
};

document.getElementById('confirmBtn').onclick = () => {
  if (pendingDeleteAction) pendingDeleteAction();
  closeModal();
};

/**
 * SISTEMA DE ESTATÍSTICAS (NOVO)
 */
const updateDashboard = () => {
  const total = state.tasks.length;
  const pending = state.tasks.filter(t => t.status !== "Concluído").length;
  const completed = state.tasks.filter(t => t.status === "Concluído").length;
  
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  if(document.getElementById('totalTasks')) document.getElementById('totalTasks').innerText = total;
  if(document.getElementById('pendingTasks')) document.getElementById('pendingTasks').innerText = pending;
  if(document.getElementById('completionRate')) document.getElementById('completionRate').innerText = `${rate}%`;
};

/**
 * NOTIFICAÇÕES E LOGS
 */
const addLog = (message) => {
  const time = new Date().toLocaleTimeString();
  state.logs.unshift(`[${time}] ${message}`);
  const logContainer = document.getElementById('logs');
  if (logContainer) {
    logContainer.innerHTML = state.logs
      .slice(0, 50)
      .map(log => `<p class="text-[11px] border-b border-gray-100 py-1 text-gray-500 font-mono">${log}</p>`)
      .join('');
  }
};

const addNotification = (message, type = 'success') => {
  const container = document.getElementById('notifications');
  const colors = {
    success: 'bg-green-50 border-green-500 text-green-700',
    warning: 'bg-red-50 border-red-500 text-red-700',
    info: 'bg-indigo-50 border-indigo-500 text-indigo-700'
  };

  const notification = document.createElement('div');
  notification.className = `p-3 mb-2 border-l-4 rounded shadow-sm text-xs font-medium animate-bounce ${colors[type]}`;
  notification.innerHTML = message;

  container.prepend(notification);
  setTimeout(() => {
    notification.classList.replace('animate-bounce', 'opacity-0');
    setTimeout(() => notification.remove(), 500);
  }, 3500);
};

/**
 * RENDERIZAÇÃO CORE
 */
const saveAndRender = () => {
  localStorage.setItem('users', JSON.stringify(state.users));
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
  render();
  updateDashboard();
};

// Ícone SVG de lixo para reutilizar
const trashIcon = `<svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;

const render = () => {
  // Render de Usuários
  const userList = document.getElementById('userList');
  userList.innerHTML = state.users.map((u, index) => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="p-2 border text-sm">${u.email}</td>
      <td class="p-2 border text-[10px] font-bold text-indigo-600">${u.role}</td>
      <td class="p-2 border text-center">
        <button onclick="toggleUserStatus(${index})" 
                class="px-2 py-1 rounded text-[10px] font-bold transition-all ${u.active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-100'}">
          ${u.active ? '● Ativo' : '○ Inativo'}
        </button>
      </td>
      <td class="p-2 border text-center">
        <button onclick="deleteUser(${index})" class="text-gray-300 hover:text-red-500 transition-colors">
           ${trashIcon}
        </button>
      </td>
    </tr>
  `).join('');

  // Render de Tarefas
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = state.tasks.map((t, index) => {
    const statusClasses = {
      "Pendente": "text-blue-500 bg-blue-50 border-blue-100",
      "Em Progresso": "text-orange-600 bg-orange-50 border-orange-100",
      "Concluído": "text-gray-400 bg-gray-100 border-gray-200 line-through"
    };

    return `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="p-2 border text-sm font-medium text-gray-700">${t.title}</td>
        <td class="p-2 border text-center">
          <span class="text-[9px] px-2 py-0.5 rounded font-black border ${t.type === 'bug' ? 'border-red-200 text-red-500' : 'border-indigo-200 text-indigo-500'} uppercase">
            ${t.type}
          </span>
        </td>
        <td class="p-2 border text-center">
          <button onclick="cycleTaskStatus(${index})" class="text-[10px] px-2 py-1 rounded border font-bold ${statusClasses[t.status]}">
            ${t.status}
          </button>
        </td>
        <td class="p-2 border text-center">
          <button onclick="deleteTask(${index})" class="text-gray-300 hover:text-red-500 transition-colors">
             ${trashIcon}
          </button>
        </td>
      </tr>
    `;
  }).join('');
};

/**
 * AÇÕES GLOBAIS
 */
window.toggleUserStatus = (index) => {
  state.users[index].active = !state.users[index].active;
  addNotification(`Usuário ${state.users[index].active ? 'ativado' : 'desativado'}`, 'info');
  saveAndRender();
};

window.cycleTaskStatus = (index) => {
  const current = state.tasks[index].status;
  const next = taskStatusCycle[(taskStatusCycle.indexOf(current) + 1) % taskStatusCycle.length];
  state.tasks[index].status = next;
  addLog(`Tarefa "${state.tasks[index].title}" -> ${next}`);
  saveAndRender();
};

window.deleteUser = (index) => {
  openModal(`Tens a certeza que desejas eliminar o usuário ${state.users[index].email}?`, () => {
    addLog(`Usuário removido: ${state.users[index].email}`);
    state.users.splice(index, 1);
    saveAndRender();
  });
};

window.deleteTask = (index) => {
  openModal(`Eliminar a tarefa "${state.tasks[index].title}" permanentemente?`, () => {
    addLog(`Tarefa eliminada: ${state.tasks[index].title}`);
    state.tasks.splice(index, 1);
    saveAndRender();
  });
};

/**
 * EVENTOS
 */
document.getElementById('userForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('userEmail').value;
  
  if (state.users.some(u => u.email === email)) {
    addNotification("Erro: Este email já existe!", "warning");
    return;
  }

  state.users.push({ 
    email, 
    role: document.getElementById('userRole').value, 
    active: true 
  });
  addNotification("Usuário criado com sucesso!");
  saveAndRender();
  e.target.reset();
});

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  state.tasks.push({ 
    title: document.getElementById('taskTitle').value, 
    type: document.getElementById('taskType').value, 
    status: "Pendente" 
  });
  addNotification("Tarefa adicionada!");
  saveAndRender();
  e.target.reset();
});

// Init
saveAndRender();