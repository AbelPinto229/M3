import express from "express";
import * as tagController from "../controllers/tagController.js";

const router = express.Router();

router.get("/", tagController.getTags);
router.post("/", tagController.createTag);
router.get("/:id/tasks", tagController.getTasksForTag);
router.delete("/:id", tagController.deleteTag);

export default router;
