import { TaskService } from '../services/TaskService.js';
import { UserService } from '../services/UserService.js';
export declare class RenderModals {
    private taskService;
    private userService;
    private pendingDeleteAction;
    constructor(taskService: TaskService, userService: UserService);
    openConfirmModal(message: string, confirmCallback: () => void): void;
    closeConfirmModal(): void;
    confirmAction(): void;
    openEditTitleModal(taskId: number): void;
    closeEditTitleModal(): void;
    saveEditTitle(taskId: number): void;
    openModal(title: string, content: string): void;
    closeModal(): void;
}
