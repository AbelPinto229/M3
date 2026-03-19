import express from "express";
import * as favoriteController from "../controllers/favoriteController.js";

const router = express.Router();

router.get("/user/:userId", favoriteController.getFavoritesByUser);
router.post("/", favoriteController.addFavorite);
router.delete("/user/:userId/task/:taskId", favoriteController.removeFavorite);

export default router;
