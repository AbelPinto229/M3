import express from "express";
import * as userWatcherController from "../controllers/userWatcherController.js";

const router = express.Router();

router.get("/:userId", userWatcherController.getWatchers);
router.get("/:userId/count", userWatcherController.getWatcherCount);
router.get("/:userId/is-watching/:watcherId", userWatcherController.isWatching);
router.post("/:userId", userWatcherController.watchUser);
router.delete("/:userId/watcher/:watcherId", userWatcherController.unwatchUser);

export default router;
