import express from "express";
import * as taskController from "../controllers/taskController.js";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.post("/", taskController.createTask);
router.get("/:id/comments", commentController.getCommentsByTask);
router.post("/:id/tags", taskController.addTagToTask);
router.post("/:id/comments", commentController.createComment);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
