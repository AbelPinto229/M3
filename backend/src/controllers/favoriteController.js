import * as favoriteService from "../services/favoriteService.js";

export const getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await favoriteService.getFavoritesByUser(Number(req.params.userId));
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const addFavorite = async (req, res) => {
  try {
    const favoriteData = {
      user_id: req.body.user_id || req.body.userId,
      task_id: req.body.task_id || req.body.taskId
    };
    const favorite = await favoriteService.addFavorite(favoriteData);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const removeFavorite = async (req, res) => {
  try {
    await favoriteService.removeFavorite(
      Number(req.params.userId),
      Number(req.params.taskId)
    );
    res.json({ message: "Favorito removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
