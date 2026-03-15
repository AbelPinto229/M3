const userService = require('../services/userService');

const getUsers = (req, res) => {
  const { search, sort } = req.query;

  let result = userService.getAllUsers();

  if (search) {
    result = userService.searchUsers(search);
  }

  if (sort) {
    result = userService.sortUsers(sort);
  } else if (search) {
    // Já está filtrado, não precisa sort padrão
  } else {
    result = userService.sortUsers('asc');
  }

  res.json(result);
};

const createUser = (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  const result = userService.createUser(nome, email);

  if (result.error) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const result = userService.updateUser(id, updates);

  if (!result) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }

  if (result.error) {
    return res.status(400).json(result);
  }

  res.json(result);
};

const toggleUserStatus = (req, res) => {
  const { id } = req.params;

  const result = userService.toggleUserStatus(id);

  if (!result) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }

  res.json(result);
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const deleted = userService.deleteUser(id);

  if (!deleted) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }

  res.status(204).send();
};

const getUserStats = (req, res) => {
  const stats = userService.getUserStats();
  res.json(stats);
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserStats
};
