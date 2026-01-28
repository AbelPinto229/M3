import { TaskStatus } from '../tasks/TaskStatus.js';
import { BugTask } from '../tasks/BugTask.js';
export class TaskService {
    tasks = [
        { id: 1, title: 'Review class 2 slides', type: 'task', status: 'Pendente', priority: 'MEDIUM', deadline: '2026-02-05', assigned: ['0'] },
        { id: 2, title: 'Do guided exercises', type: 'task', status: 'Em Progresso', priority: 'HIGH', deadline: '2026-02-03', assigned: ['1', '3'] },
        { id: 3, title: 'Do autonomous exercises', type: 'task', status: 'Pendente', priority: 'LOW', deadline: '2026-02-10', assigned: [] }
    ];
    nextId = 4;
    getTasks() {
        return this.tasks;
    }
    getTaskById(id) {
        return this.tasks.find(t => t.id === id);
    }
    getTasksByStatus(status) {
        return this.tasks.filter(t => t.status === status);
    }
    addTask(title, type, deadline) {
        let task;
        // Use BugTask for bug-type tasks
        if (type.toLowerCase() === 'bug') {
            const bugTask = new BugTask(this.nextId++, title);
            task = {
                id: bugTask.id,
                title: bugTask.title,
                type,
                status: bugTask.status,
                deadline
            };
        }
        else {
            task = {
                id: this.nextId++,
                title,
                type,
                status: TaskStatus.PENDING,
                deadline
            };
        }
        this.tasks.push(task);
        return task;
    }
    updateTaskStatus(id, status) {
        const task = this.getTaskById(id);
        if (task)
            task.status = status;
    }
    updateTaskTitle(id, title) {
        const task = this.getTaskById(id);
        if (task)
            task.title = title;
    }
    updateTaskPriority(id, priority) {
        const task = this.getTaskById(id);
        if (task)
            task.priority = priority;
    }
    updateTaskDeadline(id, deadline) {
        const task = this.getTaskById(id);
        if (task)
            task.deadline = deadline;
    }
    assignUser(taskId, email) {
        const task = this.getTaskById(taskId);
        if (task) {
            if (!task.assigned)
                task.assigned = [];
            if (!task.assigned.includes(email)) {
                task.assigned.push(email);
            }
        }
    }
    unassignUser(taskId, email) {
        const task = this.getTaskById(taskId);
        if (task && task.assigned) {
            task.assigned = task.assigned.filter(e => e !== email);
        }
    }
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
    }
}
//# sourceMappingURL=TaskService.js.map