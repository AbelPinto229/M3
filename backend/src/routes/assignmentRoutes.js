import express from "express";
import * as assignmentController from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/task/:taskId", assignmentController.getAssignmentsByTask);
router.get("/user/:userId", assignmentController.getAssignmentsByUser);
router.post("/task/:taskId", assignmentController.assignUserToTask);
router.delete("/task/:taskId/user/:userId", assignmentController.removeAssignment);
router.delete("/task/:taskId/all", assignmentController.clearTaskAssignments);

export default router;
