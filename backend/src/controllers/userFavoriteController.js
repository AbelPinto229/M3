import * as userFavoriteService from '../services/userFavoriteService.js';

export const getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await userFavoriteService.getFavoritesByUser(Number(req.params.userId));
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { favorite_user_id } = req.body;
    if (!favorite_user_id) return res.status(400).json({ error: 'favorite_user_id obrigatório' });
    await userFavoriteService.addFavorite(userId, Number(favorite_user_id));
    res.status(201).json({ message: 'Favorito adicionado' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.json({ message: 'Já é favorito' });
    res.status(500).json({ error: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const favoriteUserId = Number(req.params.favoriteUserId);
    await userFavoriteService.removeFavorite(userId, favoriteUserId);
    res.json({ message: 'Favorito removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const isFavorite = async (req, res) => {
  try {
    const result = await userFavoriteService.isFavorite(
      Number(req.params.userId),
      Number(req.params.favoriteUserId)
    );
    res.json({ isFavorite: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
