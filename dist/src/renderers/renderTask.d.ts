import { TaskService } from '../services/TaskService.js';
import { UserService } from '../services/UserService.js';
import { TagService } from '../services/TagService.js';
import { SearchService } from '../services/SearchService.js';
export declare class RenderTask {
    private taskService;
    private userService;
    private tagService;
    private searchService;
    constructor(taskService: TaskService, userService: UserService, tagService: TagService, searchService: SearchService);
    render(): void;
    private renderTaskRow;
}
