// --- ENUMS E SEGURANÇA ---
const UserRole = {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    MEMBER: "MEMBER",
    VIEWER: "VIEWER"
};

const TaskStatus = {
    CREATED: "CREATED",
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "IN_PROGRESS",
    BLOCKED: "BLOCKED",
    COMPLETED: "COMPLETED",
    ARCHIVED: "ARCHIVED"
};

const Permissions = {
    canCreateTask: (role) => [UserRole.ADMIN, UserRole.MANAGER].includes(role),
    canToggleUser: (role) => role === UserRole.ADMIN
};

// --- CLASSES BASE ---
class BaseEntity {
    constructor(id) {
        this.id = id;
        this.createdAt = new Date();
    }
}

class UserClass extends BaseEntity {
    constructor(id, email, role) {
        super(id);
        this._email = email;
        this._role = role;
        this._active = true;
    }
    get email() { return this._email; }
    get role() { return this._role; }
    get active() { return this._active; }
    toggleActive() { this._active = !this._active; }
}

// --- TAREFAS (POLIMORFISMO) ---
class Task extends BaseEntity {
    constructor(id, title, type) {
        super(id);
        this.title = title;
        this.type = type;
        this.status = TaskStatus.CREATED;
        this.completed = false;
    }

    moveTo(newStatus) {
        // Validação simples de fluxo
        this.status = newStatus;
        if (newStatus === TaskStatus.COMPLETED) this.completed = true;
    }
}

class BugTask extends Task {
    constructor(id, title) { super(id, title, "bug"); }
    getType() { return "bug"; }
}

class FeatureTask extends Task {
    constructor(id, title) { super(id, title, "feature"); }
    getType() { return "feature"; }
}

// --- SERVIÇOS ---
class HistoryLog {
    constructor() { this.logs = []; }
    addLog(msg) { 
        const entry = `[${new Date().toLocaleTimeString()}] ${msg}`;
        this.logs.unshift(entry); 
    }
}

class NotificationService {
    constructor() { this.notifs = []; }
    notify(msg) { this.notifs.unshift(msg); }
}

// === LÓGICA DA APLICAÇÃO ===
const history = new HistoryLog();
const notifier = new NotificationService();
let users = [];
let tasks = [];

// Mock de Usuário Logado
const loggedUser = new UserClass(0, 'admin@system.com', UserRole.ADMIN);

// Elementos DOM
const userList = document.getElementById('userList');
const taskList = document.getElementById('taskList');
const logsDiv = document.getElementById('logs');
const notifDiv = document.getElementById('notifications');

function updateUI() {
    // Render Logs
    logsDiv.innerHTML = history.logs.map(l => `<div class="border-b p-1">${l}</div>`).join('');
    // Render Notifications
    notifDiv.innerHTML = notifier.notifs.map(n => `<div class="border-b p-1 text-blue-600">${n}</div>`).join('');
    
    // Render Users
    userList.innerHTML = users.map(u => `
        <tr class="border-b">
            <td class="p-2">${u.email}</td>
            <td class="p-2 text-xs font-bold">${u.role}</td>
            <td class="p-2 ${u.active ? 'text-green-600' : 'text-red-600'}">${u.active ? 'Ativo' : 'Inativo'}</td>
            <td class="p-2">
                <button onclick="toggleUser(${u.id})" class="bg-gray-200 p-1 rounded text-xs">Alternar</button>
            </td>
        </tr>
    `).join('');

    // Render Tasks
    taskList.innerHTML = tasks.map(t => `
        <tr class="border-b">
            <td class="p-2">${t.title}</td>
            <td class="p-2"><span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${t.type}</span></td>
            <td class="p-2 text-xs">${t.status}</td>
            <td class="p-2">
                <button onclick="advanceTask(${t.id})" class="bg-indigo-500 text-white p-1 rounded text-xs">Próximo</button>
            </td>
        </tr>
    `).join('');
}

// Funções Globais (para os botões)
window.toggleUser = (id) => {
    if (!Permissions.canToggleUser(loggedUser.role)) return alert("Sem permissão!");
    const user = users.find(u => u.id === id);
    user.toggleActive();
    history.addLog(`Status de ${user.email} alterado.`);
    updateUI();
};

window.advanceTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const flow = Object.values(TaskStatus);
    const nextIdx = flow.indexOf(task.status) + 1;
    if (nextIdx < flow.length) {
        task.moveTo(flow[nextIdx]);
        history.addLog(`Tarefa "${task.title}" -> ${task.status}`);
        notifier.notify(`Alerta: Tarefa ${task.title} atualizada.`);
        updateUI();
    }
};

// Eventos de Formulário
document.getElementById('userForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    users.push(new UserClass(Date.now(), email, role));
    history.addLog(`Usuário ${email} criado.`);
    updateUI();
    e.target.reset();
});

document.getElementById('taskForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!Permissions.canCreateTask(loggedUser.role)) return alert("Apenas ADMIN ou MANAGER criam tarefas!");
    
    const title = document.getElementById('taskTitle').value;
    const type = document.getElementById('taskType').value;
    const newTask = type === 'bug' ? new BugTask(Date.now(), title) : new FeatureTask(Date.now(), title);
    
    tasks.push(newTask);
    history.addLog(`Tarefa "${title}" adicionada.`);
    updateUI();
    e.target.reset();
});

// Init
updateUI();