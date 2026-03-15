const userService = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const { search, sort } = req.query;
    let result;

    if (search) {
      result = await userService.searchUsers(search);
    } else if (sort) {
      result = await userService.sortUsers(sort);
    } else {
      result = await userService.sortUsers('asc');
    }

    res.json(result);
  } catch (error) {
    console.error('Erro ao obter utilizadores:', error);
    res.status(500).json({ error: "Erro ao obter utilizadores" });
  }
};

const createUser = async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: "Nome e email são obrigatórios" });
    }

    const result = await userService.createUser(nome, email);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).json({ error: "Erro ao criar utilizador" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await userService.updateUser(id, updates);

    if (!result) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    res.status(500).json({ error: "Erro ao atualizar utilizador" });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userService.toggleUserStatus(id);

    if (!result) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    res.json(result);
  } catch (error) {
    console.error('Erro ao alternar status:', error);
    res.status(500).json({ error: "Erro ao alternar status" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover utilizador:', error);
    res.status(500).json({ error: "Erro ao remover utilizador" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserStats
};
