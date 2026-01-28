import { Task } from "../models/Task";
import { TagService } from "./TagService";
export declare class SearchService {
    private tasks;
    constructor(tasks: Task[]);
    searchByTitle(text: string): Task[];
    searchByUser(userId: number, assignmentService: any): Task[];
    searchByStatus(status: string): Task[];
    globalSearch(query: string, assignmentService: any): Task[];
    filterTasks(tasks: Task[], criteria: {
        text: string;
        status: string;
        priority: string;
        type: string;
        tag: string;
    }, tagService: TagService): Task[];
}
