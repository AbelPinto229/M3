import { Task } from "../models/Task";
import { TagManager } from "../utils/TagManager";
import { TaskService } from "./TaskService.js";
export declare class SearchService {
    private taskService;
    constructor(taskService: TaskService);
    searchByTitle(text: string): Task[];
    searchByUser(userId: number, assignmentService: any): Task[];
    searchByStatus(status: string): Task[];
    globalSearch(query: string, assignmentService: any): Task[];
    narrowSearch(tasks: Task[], criteria: {
        text: string;
        status: string;
        priority: string;
        type: string;
        tag: string;
    }, tagService: TagManager<any>): Task[];
}
