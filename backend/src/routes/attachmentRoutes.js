import express from "express";
import * as attachmentController from "../controllers/attachmentController.js";

const router = express.Router();

router.get("/task/:taskId", attachmentController.getAttachmentsByTask);
router.post("/task/:taskId", attachmentController.createAttachment);
router.delete("/:id", attachmentController.deleteAttachment);

export default router;
