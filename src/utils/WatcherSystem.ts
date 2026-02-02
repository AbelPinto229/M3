export class WatcherSystem<T, U> {
  private watchers: Map<T, U[]> = new Map();

  // adds a user to watch a target
  watch(target: T, user: U): void {
    if (!this.watchers.has(target)) {
      this.watchers.set(target, []);
    }
    const targetWatchers = this.watchers.get(target)!;
    if (!targetWatchers.includes(user)) {
      targetWatchers.push(user);
    }
  }

  // removes a user from watching a target
  unwatch(target: T, user: U): void {
    const targetWatchers = this.watchers.get(target);
    if (targetWatchers) {
      this.watchers.set(target, targetWatchers.filter(w => w !== user));
    }
  }

  // gets all users watching a target
  getWatchers(target: T): U[] {
    return this.watchers.get(target) || [];
  }
}