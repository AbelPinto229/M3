import * as ratingService from "../services/ratingService.js";

export const getRatingsByTask = async (req, res) => {
  try {
    const ratings = await ratingService.getRatingsByTask(Number(req.params.taskId));
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createRating = async (req, res) => {
  try {
    console.log('📝 Recebendo request para criar rating:', req.body);
    const ratingData = {
      task_id: Number(req.params.taskId),
      user_id: req.body.user_id || req.body.userId,
      rating_value: req.body.rating_value || req.body.ratingValue || req.body.rating
    };
    console.log('📝 Dados do rating processados:', ratingData);
    const rating = await ratingService.createRating(ratingData);
    res.status(201).json(rating);
  } catch (error) {
    console.error('❌ Erro ao criar rating:', error);
    res.status(500).json({ error: error.message });
  }
}

export const getAverageRating = async (req, res) => {
  try {
    const average = await ratingService.getAverageRating(Number(req.params.taskId));
    res.json(average);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteRating = async (req, res) => {
  try {
    await ratingService.deleteRating(Number(req.params.id));
    res.json({ message: "Rating deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
