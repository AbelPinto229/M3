import { Task } from "../models/Task";
import { TagService } from "./TagService";

// SEARCH SERVICE - Search and filtering
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
    // Try to parse query as numeric userId
    const userId = Number(query);
    const byUser = isNaN(userId)
      ? []
      : this.searchByUser(userId, assignmentService);

    const all = [...byTitle, ...byStatus, ...byUser];
    return Array.from(new Set(all)); // Remove duplicates
  }

  filterTasks(tasks: Task[], criteria: {
    text: string;
    status: string;
    priority: string;
    type: string;
    tag: string;
  }, tagService: TagService): Task[] {
    return tasks.filter(task => {
      const matchTitle = task.title.toLowerCase().includes(criteria.text.toLowerCase());
      const matchStatus = criteria.status === "" || task.status === criteria.status;
      const matchPriority = criteria.priority === "" || (task as any).priority === criteria.priority;
      const matchType = criteria.type === "" || task.type === criteria.type;
      const taskTags = tagService.getTags(task.id);
      const matchTag = criteria.tag === "" || taskTags.some(t => t.includes(criteria.tag.toLowerCase()));
      return matchTitle && matchStatus && matchPriority && matchType && matchTag;
    });
  }
}
