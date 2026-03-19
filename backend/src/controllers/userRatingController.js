import * as userRatingService from "../services/userRatingService.js";

export const rateUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { rated_by, rating } = req.body;
    if (!rated_by || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rated_by e rating (1-5) são obrigatórios' });
    }
    const result = await userRatingService.rateUser(userId, Number(rated_by), Number(rating));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const result = await userRatingService.getAverageRating(Number(req.params.userId));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatings = async (req, res) => {
  try {
    const ratings = await userRatingService.getRatings(Number(req.params.userId));
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
