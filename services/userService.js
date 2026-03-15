const User = require('../models/User');

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getAllUsers = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    console.error('Erro ao obter utilizadores:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    return await User.findByPk(id);
  } catch (error) {
    console.error('Erro ao obter utilizador:', error);
    throw error;
  }
};

const createUser = async (nome, email) => {
  if (!isValidEmail(email)) {
    return { error: "Email inválido" };
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { error: "Email já existe" };
    }

    const newUser = await User.create({
      nome,
      email,
      ativo: true
    });

    return newUser;
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    throw error;
  }
};

const updateUser = async (id, updates) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return null;
    }

    if (updates.email && !isValidEmail(updates.email)) {
      return { error: "Email inválido" };
    }

    if (updates.email && updates.email !== user.email) {
      const emailExists = await User.findOne({ where: { email: updates.email } });
      if (emailExists) {
        return { error: "Email já existe" };
      }
    }

    await user.update(updates);
    return user;
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  } catch (error) {
    console.error('Erro ao remover utilizador:', error);
    throw error;
  }
};

const toggleUserStatus = async (id) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return null;
    }

    user.ativo = !user.ativo;
    await user.save();
    return user;
  } catch (error) {
    console.error('Erro ao alternar status:', error);
    throw error;
  }
};

const getUserStats = async () => {
  try {
    const total = await User.count();
    const ativos = await User.count({ where: { ativo: true } });
    const percentagem = total > 0 ? ((ativos / total) * 100).toFixed(2) : 0;

    return {
      total,
      ativos,
      percentagem: parseFloat(percentagem)
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};

const searchUsers = async (searchTerm) => {
  try {
    const { Op } = require('sequelize');
    return await User.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });
  } catch (error) {
    console.error('Erro ao pesquisar utilizadores:', error);
    throw error;
  }
};

const sortUsers = async (order = 'asc') => {
  try {
    return await User.findAll({
      order: [['nome', order.toUpperCase()]]
    });
  } catch (error) {
    console.error('Erro ao ordenar utilizadores:', error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
  searchUsers,
  sortUsers
};
