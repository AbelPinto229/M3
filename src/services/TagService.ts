// TAG SERVICE - Manages task tags and categorization
export class TagService {
  // Maps task IDs to their set of tags
  private tags: Map<number, Set<string>> = new Map();

  // Adds a tag to a task
  addTag(taskId: number, tag: string) {
    if (!this.tags.has(taskId)) this.tags.set(taskId, new Set());
    this.tags.get(taskId)?.add(tag);
  }

  // Removes a tag from a task
  removeTag(taskId: number, tag: string) {
    this.tags.get(taskId)?.delete(tag);
  }

  // Retrieves all tags for a specific task
  getTags(taskId: number): string[] {
    return Array.from(this.tags.get(taskId) || []);
  }

  // Retrieves all task IDs that have a specific tag
  getTasksByTag(tag: string): number[] {
    const result: number[] = [];
    this.tags.forEach((tagsSet, taskId) => {
      if (tagsSet.has(tag)) result.push(taskId);
    });
    return result;
  }
}
