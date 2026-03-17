// Simple in-memory cache utility
export class SimpleCache {
    cache = new Map();
    constructor() { }
    //stores a value with a key
    set(key, value) {
        this.cache.set(key, value);
    }
    //retrieves a value by key (returns undefined if not found)
    get(key) {
        return this.cache.get(key);
    }
}
//# sourceMappingURL=SimpleCache.js.map