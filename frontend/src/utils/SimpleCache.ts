import { Task } from '../models/Task.js';
import { User } from '../models/Users.js';

// Simple in-memory cache utility
export class SimpleCache<K, T> {
  private cache: Map<K, T> = new Map();
  
  constructor() {}
  
  //stores a value with a key
  set(key: K, value: T): void {
    this.cache.set(key, value);
  }
  
  //retrieves a value by key (returns undefined if not found)
  get(key: K): T | undefined {
    return this.cache.get(key) as T | undefined;
  }
  
}
