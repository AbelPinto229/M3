import express from "express";
import * as ratingController from "../controllers/ratingController.js";

const router = express.Router();

router.get("/task/:taskId", ratingController.getRatingsByTask);
router.get("/task/:taskId/average", ratingController.getAverageRating);
router.post("/task/:taskId", ratingController.createRating);
router.delete("/:id", ratingController.deleteRating);

export default router;
