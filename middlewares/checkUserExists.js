const userService = require('../services/userService');

const checkUserExists = (req, res, next) => {
  const userId = req.params.id;

  const user = userService.getUserById(userId);

  if (!user) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }

  req.user = user;
  next();
};

module.exports = {
  checkUserExists
};
