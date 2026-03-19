import express from "express";
import * as messageController from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations/:userId", messageController.getConversations);
router.get("/unread/:userId", messageController.getUnreadCount);
router.get("/:userId/:otherUserId", messageController.getMessages);
router.post("/", messageController.sendMessage);

export default router;
