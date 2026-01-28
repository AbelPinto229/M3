export class TagService {
  private tags: Map<number, Set<string>> = new Map();

  addTag(taskId: number, tag: string) {
    if (!this.tags.has(taskId)) this.tags.set(taskId, new Set());
    this.tags.get(taskId)?.add(tag);
  }

  removeTag(taskId: number, tag: string) {
    this.tags.get(taskId)?.delete(tag);
  }

  getTags(taskId: number): string[] {
    return Array.from(this.tags.get(taskId) || []);
  }

  getTasksByTag(tag: string): number[] {
    const result: number[] = [];
    this.tags.forEach((tagsSet, taskId) => {
      if (tagsSet.has(tag)) result.push(taskId);
    });
    return result;
  }
}
