// FAVORITE SERVICE - Manages user favorites with API integration
export class FavoriteService {
    API_BASE_URL = 'http://localhost:3000';
    // Local cache of favorites: Map<userId, Set<taskId>>
    userFavorites = new Map();
    // Loads favorites for a specific user from API
    async loadUserFavorites(userId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/favorites/user/${userId}`);
            if (response.ok) {
                const favorites = await response.json();
                const taskIds = new Set(favorites.map((f) => f.task_id || f.taskId));
                this.userFavorites.set(userId, taskIds);
                console.log('✅ Favoritos carregados da API:', favorites.length);
            }
        }
        catch (error) {
            console.error('⚠️ Erro ao carregar favoritos da API:', error);
            // Initialize empty set on error
            if (!this.userFavorites.has(userId)) {
                this.userFavorites.set(userId, new Set());
            }
        }
    }
    // Checks if a task is favorited by a user
    isFavorite(userId, taskId) {
        const favorites = this.userFavorites.get(userId);
        return favorites ? favorites.has(taskId) : false;
    }
    // Adds a task to user's favorites
    async addFavorite(userId, taskId) {
        console.log('⭐ Frontend: Adicionando favorito', { userId, taskId });
        try {
            const response = await fetch(`${this.API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, task_id: taskId })
            });
            console.log('📡 Resposta da API:', response.status, response.ok);
            if (response.ok) {
                if (!this.userFavorites.has(userId)) {
                    this.userFavorites.set(userId, new Set());
                }
                this.userFavorites.get(userId)?.add(taskId);
                console.log('✅ Favorito adicionado na API');
                return true;
            }
            console.error('❌ Erro ao adicionar favorito:', response.status);
            return false;
        }
        catch (error) {
            console.error('⚠️ Erro ao adicionar favorito:', error);
            return false;
        }
    }
    // Removes a task from user's favorites
    async removeFavorite(userId, taskId) {
        console.log('🗑️ Frontend: Removendo favorito', { userId, taskId });
        try {
            const response = await fetch(`${this.API_BASE_URL}/favorites/user/${userId}/task/${taskId}`, {
                method: 'DELETE'
            });
            console.log('📡 Resposta da API:', response.status, response.ok);
            if (response.ok) {
                this.userFavorites.get(userId)?.delete(taskId);
                console.log('✅ Favorito removido na API');
                return true;
            }
            console.error('❌ Erro ao remover favorito:', response.status);
            return false;
        }
        catch (error) {
            console.error('⚠️ Erro ao remover favorito:', error);
            return false;
        }
    }
    // Gets all favorite task IDs for a user
    getUserFavorites(userId) {
        const favorites = this.userFavorites.get(userId);
        return favorites ? Array.from(favorites) : [];
    }
}
//# sourceMappingURL=FavoriteService.js.map