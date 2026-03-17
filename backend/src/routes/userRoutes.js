import express from "express";
import * as userController from "../controllers/userController.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/stats", userController.getUserStats);
router.post("/", userController.createUser);
router.put("/:id", checkUserExists, userController.updateUser);
router.patch("/:id", checkUserExists, userController.toggleUserStatus);
router.delete("/:id", checkUserExists, userController.deleteUser);
router.get("/:id", checkUserExists, (req, res) => {
  res.json(req.user);
});

export default router;
