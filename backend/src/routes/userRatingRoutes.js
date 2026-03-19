import express from "express";
import * as userRatingController from "../controllers/userRatingController.js";

const router = express.Router();

router.get("/:userId/average", userRatingController.getAverageRating);
router.get("/:userId", userRatingController.getRatings);
router.post("/:userId", userRatingController.rateUser);

export default router;
