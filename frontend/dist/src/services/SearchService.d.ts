import { Task } from "../models/Task";
import { TagManager } from "../utils/TagManager";
export declare class SearchService {
    private tasks;
    constructor(tasks: Task[]);
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
