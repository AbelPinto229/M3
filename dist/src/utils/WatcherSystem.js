export class WatcherSystem {
    watchers = new Map();
    // adds a user to watch a target
    watch(target, user) {
        if (!this.watchers.has(target)) {
            this.watchers.set(target, []);
        }
        const targetWatchers = this.watchers.get(target);
        if (!targetWatchers.includes(user)) {
            targetWatchers.push(user);
        }
    }
    // removes a user from watching a target
    unwatch(target, user) {
        const targetWatchers = this.watchers.get(target);
        if (targetWatchers) {
            this.watchers.set(target, targetWatchers.filter(w => w !== user));
        }
    }
    // gets all users watching a target
    getWatchers(target) {
        return this.watchers.get(target) || [];
    }
}
//# sourceMappingURL=WatcherSystem.js.map