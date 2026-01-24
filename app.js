import { UserClass } from './models/UserClass.js';
import { UserRole } from './security/UserRole.js';
import { canCreateTask } from './security/Permissions.js';
import { BugTask } from './tasks/BugTask.js';
import { FeatureTask } from './tasks/FeatureTask.js';
import { processTask } from './tasks/TaskUtils.js';
import { HistoryLog } from './logs/HistoryLog.js';
import { NotificationService } from './notifications/NotificationService.js';
import { TaskStatus } from './tasks/TaskStatus.js';

// === INIT ===
const history = new HistoryLog();
const notifier = new NotificationService();

let users = [];
let tasks = [];
let userIdCounter = 1;
let taskIdCounter = 1;

// Usuário logado
const loggedUser = new UserClass(0, 'admin@system.com', UserRole.ADMIN);

// DOM
const userList = document.getElementById('userList');
const taskList = document.getElementById('taskList');
const logsDiv = document.getElementById('logs');
const notificationsDiv = document.getElementById('notifications');

// === FUNÇÕES ===
function updateLogs() {
  logsDiv.innerHTML = history.getLogs().map(l => `<div class="log-entry p-1 border-b">${l}</div>`).join('');
}
function updateNotifications() {
  notificationsDiv.innerHTML = notifier.getAll().map(n => `<div class="log-entry p-1 border-b">${n}</div>`).join('');
}

function renderUsers() {
  userList.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.className = "border-b";
    tr.innerHTML = `
      <td class="p-2">${u.email}</td>
      <td class="p-2">${u.role}</td>
      <td class="p-2 ${u.active?'text-green-600 font-bold':'text-red-600 font-bold'}">${u.active?'Ativo':'Inativo'}</td>
      <td class="p-2"><button class="btn-toggle bg-indigo-500 hover:bg-indigo-400 text-white p-1 rounded">Toggle</button></td>
    `;
    const btn = tr.querySelector('button');
    if (loggedUser.role === UserRole.ADMIN) {
      btn.addEventListener('click', () => {
        u.toggleActive();
        renderUsers();
        history.addLog(`Usuário ${u.email} alterou status para ${u.active?'Ativo':'Inativo'}`);
        updateLogs();
      });
    } else btn.disabled = true;

    userList.appendChild(tr);
  });
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(t => {
    const tr = document.createElement('tr');
    tr.className = "border-b";
    tr.innerHTML = `
      <td class="p-2">${t.title}</td>
      <td class="p-2">${t.type}</td>
      <td class="p-2">${t.status}</td>
      <td class="p-2"><button class="btn-advance bg-indigo-500 hover:bg-indigo-400 text-white p-1 rounded">Avançar</button></td>
    `;
    const btn = tr.querySelector('button');
    if (canCreateTask(loggedUser.role)) {
      btn.addEventListener('click', () => advanceTask(t));
    } else btn.disabled = true;

    taskList.appendChild(tr);
  });
}

function advanceTask(task) {
  const statusOrder = [
    TaskStatus.CREATED,
    TaskStatus.ASSIGNED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.BLOCKED,
    TaskStatus.COMPLETED,
    TaskStatus.ARCHIVED
  ];
  const idx = statusOrder.indexOf(task.status);
  if (idx < statusOrder.length - 1) {
    task.moveTo(statusOrder[idx+1]);
    renderTasks();
    history.addLog(`Tarefa "${task.title}" avançou para ${task.status}`);
    notifier.notify(`Tarefa "${task.title}" atualizada`);
    updateLogs();
    updateNotifications();
  }
}

// === FORMULÁRIOS ===
document.getElementById('userForm').addEventListener('submit', e=>{
  e.preventDefault();
  const email = document.getElementById('userEmail').value;
  const role = document.getElementById('userRole').value;
  const user = new UserClass(userIdCounter++, email, role);
  users.push(user);
  renderUsers();
  history.addLog(`Usuário criado: ${email}`);
  updateLogs();
  e.target.reset();
});

document.getElementById('taskForm').addEventListener('submit', e=>{
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const type = document.getElementById('taskType').value;
  let task = type==='bug' ? new BugTask(taskIdCounter++, title) : new FeatureTask(taskIdCounter++, title);
  tasks.push(task);
  renderTasks();
  history.addLog(`Tarefa criada: ${title}`);
  updateLogs();
  processTask(task);
  e.target.reset();
});

// === INITIAL RENDER ===
renderUsers();
renderTasks();
updateLogs();
updateNotifications();
