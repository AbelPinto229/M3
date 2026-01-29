import { TaskStatus } from '../tasks/TaskStatus.js';
import { BugTask } from '../tasks/BugTask.js';
export class TaskService {
    tasks = [
        { id: 1, title: 'Review class 2 slides', type: 'task', status: 'Created', priority: 'MEDIUM', deadline: '2026-02-05', assigned: ['0'] },
        { id: 2, title: 'Do guided exercises', type: 'task', status: 'In Progress', priority: 'HIGH', deadline: '2026-02-03', assigned: ['1', '3'] },
        { id: 3, title: 'Do autonomous exercises', type: 'task', status: 'Created', priority: 'LOW', deadline: '2026-02-10', assigned: [] }
    ];
    nextId = 4;
    // Returns all tasks
    getTasks() {
        return this.tasks;
    }
    // Retrieves a specific task by ID
    getTaskById(id) {
        return this.tasks.find(t => t.id === id);
    }
    // Retrieves all tasks with a specific status
    getTasksByStatus(status) {
        return this.tasks.filter(t => t.status === status);
    }
    // Creates a new task (uses BugTask class for bug type tasks)
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
                status: TaskStatus.CREATED,
                deadline
            };
        }
        this.tasks.push(task);
        return task;
    }
    // Updates task status
    updateTaskStatus(id, status) {
        const task = this.getTaskById(id);
        if (task)
            task.status = status;
    }
    // Updates task title
    updateTaskTitle(id, title) {
        const task = this.getTaskById(id);
        if (task)
            task.title = title;
    }
    // Updates task priority level
    updateTaskPriority(id, priority) {
        const task = this.getTaskById(id);
        if (task)
            task.priority = priority;
    }
    // Updates task deadline date
    updateTaskDeadline(id, deadline) {
        const task = this.getTaskById(id);
        if (task)
            task.deadline = deadline;
    }
    // Assigns a user to a task by email
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
    // Removes a user assignment from a task
    unassignUser(taskId, email) {
        const task = this.getTaskById(taskId);
        if (task && task.assigned) {
            task.assigned = task.assigned.filter(e => e !== email);
        }
    }
    // Deletes a task by ID
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
    }
}
//# sourceMappingURL=TaskService.js.map