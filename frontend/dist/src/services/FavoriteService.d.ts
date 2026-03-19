export declare class FavoriteService {
    private API_BASE_URL;
    private userFavorites;
    loadUserFavorites(userId: number): Promise<void>;
    isFavorite(userId: number, taskId: number): boolean;
    addFavorite(userId: number, taskId: number): Promise<boolean>;
    removeFavorite(userId: number, taskId: number): Promise<boolean>;
    getUserFavorites(userId: number): number[];
}
