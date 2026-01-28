import { RenderUser } from './src/ui/renderUser.js';
import { RenderTask } from './src/ui/renderTask.js';
import { RenderModals } from './src/ui/renderModals.js';
declare global {
    interface Window {
        services: any;
        renderTask: RenderTask;
        renderUser: RenderUser;
        renderModals: RenderModals;
        currentUserRole: string;
        currentUserId: number;
        saveAndRender: () => void;
        checkPermission: (action: string) => boolean;
        taskSortState: string;
        userFilter: string;
    }
}
export declare function initializeApp(): void;
export declare function saveAndRender(): void;
