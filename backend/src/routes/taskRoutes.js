import express from "express";
import * as taskController from "../controllers/taskController.js";

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.post("/", taskController.createTask);
router.post("/:id/tags", taskController.addTagToTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
