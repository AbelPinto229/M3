import { Task } from "../models/ask";
export declare class SearchService {
    private tasks;
    constructor(tasks: Task[]);
    searchByTitle(text: string): Task[];
    searchByUser(userId: number, assignmentService: any): Task[];
    searchByStatus(status: string): Task[];
    globalSearch(query: string, assignmentService: any): Task[];
}
