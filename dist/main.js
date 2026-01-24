"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserClass_js_1 = require("./models/UserClass.js");
const UserRole_js_1 = require("./security/UserRole.js");
const Permissions_js_1 = require("./security/Permissions.js");
const BugTask_js_1 = require("./tasks/BugTask.js");
const TaskUtils_js_1 = require("./tasks/TaskUtils.js");
const HistoryLog_js_1 = require("./logs/HistoryLog.js");
const NotificationService_js_1 = require("./notifications/NotificationService.js");
const TaskStatus_js_1 = require("./tasks/TaskStatus.js");
const history = new HistoryLog_js_1.HistoryLog();
const notifier = new NotificationService_js_1.NotificationService();
const admin = new UserClass_js_1.UserClass(1, 'admin@example.com', UserRole_js_1.UserRole.ADMIN);
const member = new UserClass_js_1.UserClass(2, 'member@example.com', UserRole_js_1.UserRole.MEMBER);
// Criar tarefa com permissão
if ((0, Permissions_js_1.canCreateTask)(admin.role)) {
    const bug = new BugTask_js_1.BugTask(1, 'Erro no login');
    bug.moveTo(TaskStatus_js_1.TaskStatus.ASSIGNED);
    history.addLog(`${admin.email} criou a tarefa ${bug.title}`);
    notifier.notifyUser(member.getId(), `Nova tarefa atribuída: ${bug.title}`);
    (0, TaskUtils_js_1.processTask)(bug); // Polimorfismo funcional
}
console.log(history.getLogs());
//# sourceMappingURL=main.js.map