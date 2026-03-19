import * as userService from "../services/userService.js";

export const checkUserExists = async (req, res, next) => {
  const userId = Number(req.params.id);
  
  try {
    const user = await userService.getUserById(userId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }
};
