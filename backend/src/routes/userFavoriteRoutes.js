import express from 'express';
import * as userFavoriteController from '../controllers/userFavoriteController.js';

const router = express.Router();

router.get('/:userId', userFavoriteController.getFavoritesByUser);
router.post('/:userId', userFavoriteController.addFavorite);
router.delete('/:userId/:favoriteUserId', userFavoriteController.removeFavorite);
router.get('/:userId/is-favorite/:favoriteUserId', userFavoriteController.isFavorite);

export default router;
