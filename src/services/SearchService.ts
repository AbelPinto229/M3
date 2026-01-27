import { Task } from "../models/task";

export class SearchService {
  constructor(private tasks: Task[]) {}

  searchByTitle(text: string): Task[] {
    return this.tasks.filter((t) =>
      t.title.toLowerCase().includes(text.toLowerCase()),
    );
  }

  searchByUser(userId: number, assignmentService: any): Task[] {
    const taskIds = assignmentService.getTasksFromUser(userId);
    return this.tasks.filter((t) => taskIds.includes(t.id));
  }

  searchByStatus(status: string): Task[] {
    return this.tasks.filter((t) => t.status === status);
  }

  globalSearch(query: string, assignmentService: any): Task[] {
    const byTitle = this.searchByTitle(query);
    const byStatus = this.searchByStatus(query);
    // assume query numérica para userId
    const userId = Number(query);
    const byUser = isNaN(userId)
      ? []
      : this.searchByUser(userId, assignmentService);

    const all = [...byTitle, ...byStatus, ...byUser];
    return Array.from(new Set(all)); // remove duplicados
  }
}
