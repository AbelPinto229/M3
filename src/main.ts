import { UserClass } from './models/UserClass';
import { UserRole } from './security/UserRole';
import { canCreateTask } from './security/Permissions';
import { BugTask } from './tasks/BugTask';
import { processTask } from './tasks/TaskUtils';
import { HistoryLog } from './logs/HistoryLog';
import { NotificationService } from './notifications/NotificationService';
import { TaskStatus } from './tasks/TaskStatus';

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
