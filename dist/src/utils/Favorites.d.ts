import { EntityList } from './EntityList.js';
export declare class Favorites<T> extends EntityList<T> {
    exists(item: T): boolean;
    remove(item: T): void;
}
