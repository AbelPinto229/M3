import { UserClass } from './models/UserClass.js';
import { UserRole } from './security/UserRole.js';
import { canCreateTask } from './security/Permissions.js';
import { BugTask } from './tasks/BugTask.js';
import { processTask } from './tasks/TaskUtils.js';
import { HistoryLog } from './logs/HistoryLog.js';
import { NotificationService } from './notifications/NotificationService.js';
import { TaskStatus } from './tasks/TaskStatus.js';

const history = new HistoryLog();
const notifier = new NotificationService();

const admin = new UserClass(1, 'admin@example.com', UserRole.ADMIN);
const member = new UserClass(2, 'member@example.com', UserRole.MEMBER);

// Criar tarefa com permissão
if (canCreateTask(admin.role)) {
    const bug = new BugTask(1, 'Erro no login');
    bug.moveTo(TaskStatus.ASSIGNED);

    history.addLog(`${admin.email} criou a tarefa ${bug.title}`);
    notifier.notifyUser(member.getId(), `Nova tarefa atribuída: ${bug.title}`);

    processTask(bug); // Polimorfismo funcional
}

console.log(history.getLogs());
