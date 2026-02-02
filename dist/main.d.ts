import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { CommentService } from './src/services/CommentService.js';
import { AttachmentService } from './src/services/AttachmentService.js';
import { TagManager } from './src/utils/TagManager.js';
import { DeadlineService } from './src/services/DeadlineService.js';
import { PriorityService } from './src/services/PriorityService.js';
import { AssignmentService } from './src/services/AssignmentService.js';
import { SearchService } from './src/services/SearchService.js';
import { StatisticsService } from './src/services/StatisticService.js';
import { BackupService } from './src/services/BackupService.js';
import { AutomationRulesService } from './src/services/AutomationRulesService.js';
import { NotificationService } from './src/notifications/NotificationService.js';
import { RenderUser } from './src/ui/renderUser.js';
import { RenderTask } from './src/ui/renderTask.js';
import { RenderModals } from './src/ui/renderModals.js';
import { User } from './src/models/Users.js';
import { Task } from './src/models/Task.js';
import { Favorites } from './src/utils/Favorites.js';
import { WatcherSystem } from './src/utils/WatcherSystem.js';
import { PriorityManager } from './src/utils/PriorityManager.js';
import { RatingSystem } from './src/utils/RatingSystem.js';
import { DependencyGraph } from './src/utils/DependencyGraph.js';
declare global {
    interface Window {
        appContext: AppContext;
        renderModals: RenderModals;
        favoriteTasks: Favorites<Task>;
        favoriteUsers: Favorites<User>;
        watcherSystem: WatcherSystem<Task | User, User>;
        priorityManager: PriorityManager<Task | User>;
        ratingSystem: RatingSystem<Task | User>;
        dependencyGraph: DependencyGraph<Task>;
        renderTasksWithPagination: (tasks: Task[]) => void;
        renderUsersWithPagination: (users: User[]) => void;
        systemStats: {
            totalEntities: number;
            systemLog: string[];
        };
    }
}
interface AppContext {
    userService: UserService;
    taskService: TaskService;
    deadlineService: DeadlineService;
    priorityService: PriorityService;
    assignmentService: AssignmentService;
    commentService: CommentService;
    attachmentService: AttachmentService;
    tagService: TagManager<any>;
    automationService: AutomationRulesService;
    statisticsService: StatisticsService;
    searchService: SearchService;
    backupService: BackupService;
    notificationService: NotificationService;
    renderUser: RenderUser;
    renderTask: RenderTask;
    renderModals: RenderModals;
    currentUserId: number;
    currentUserRole: string;
    taskSortState: string;
    userFilter: string;
    checkPermission: (action: string) => boolean;
    saveAndRender: () => void;
    saveData: () => void;
}
export declare function initializeApp(): void;
export declare function saveAndRender(): void;
export {};
