const Task = require('../models/Task');

const isValidTitle = (titulo) => titulo && titulo.length > 3;

const getAllTasks = async () => {
  try {
    return await Task.findAll();
  } catch (error) {
    console.error('Erro ao obter tarefas:', error);
    throw error;
  }
};

const getTaskById = async (id) => {
  try {
    return await Task.findByPk(id);
  } catch (error) {
    console.error('Erro ao obter tarefa:', error);
    throw error;
  }
};

const createTask = async (titulo, categoria, responsavelNome) => {
  if (!isValidTitle(titulo)) {
    return { error: "Título deve ter mais de 3 caracteres" };
  }

  if (!responsavelNome || responsavelNome.trim() === "") {
    return { error: "Responsável não pode estar vazio" };
  }

  try {
    const newTask = await Task.create({
      titulo,
      categoria,
      concluida: false,
      responsavelNome,
      dataConclusao: null
    });

    return newTask;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};

const updateTask = async (id, updates) => {
  try {
    const task = await getTaskById(id);
    if (!task) {
      return null;
    }

    if (updates.titulo && !isValidTitle(updates.titulo)) {
      return { error: "Título deve ter mais de 3 caracteres" };
    }

    if (updates.responsavelNome && updates.responsavelNome.trim() === "") {
      return { error: "Responsável não pode estar vazio" };
    }

    // Atualizar dataConclusao baseado no status concluida
    if (updates.concluida !== undefined) {
      if (updates.concluida === true) {
        updates.dataConclusao = new Date().toISOString().split('T')[0];
      } else {
        updates.dataConclusao = null;
      }
    }

    await task.update(updates);
    return task;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
};

const deleteTask = async (id) => {
  try {
    const task = await getTaskById(id);
    if (!task) {
      return false;
    }

    await task.destroy();
    return true;
  } catch (error) {
    console.error('Erro ao remover tarefa:', error);
    throw error;
  }
};

const getTaskStats = async () => {
  try {
    const total = await Task.count();
    const pendentes = await Task.count({ where: { concluida: false } });
    const concluidas = await Task.count({ where: { concluida: true } });

    return {
      total,
      pendentes,
      concluidas
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};

const searchTasks = async (searchTerm) => {
  try {
    const { Op } = require('sequelize');
    return await Task.findAll({
      where: {
        titulo: { [Op.like]: `%${searchTerm}%` }
      }
    });
  } catch (error) {
    console.error('Erro ao pesquisar tarefas:', error);
    throw error;
  }
};

const sortTasks = async (order = 'asc') => {
  try {
    return await Task.findAll({
      order: [['titulo', order.toUpperCase()]]
    });
  } catch (error) {
    console.error('Erro ao ordenar tarefas:', error);
    throw error;
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  searchTasks,
  sortTasks
};
