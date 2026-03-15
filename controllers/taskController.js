const taskService = require('../services/taskService');

const getTasks = async (req, res) => {
  try {
    const { search, sort } = req.query;
    let result;

    if (search) {
      result = await taskService.searchTasks(search);
    } else if (sort) {
      result = await taskService.sortTasks(sort);
    } else {
      result = await taskService.sortTasks('asc');
    }

    res.json(result);
  } catch (error) {
    console.error('Erro ao obter tarefas:', error);
    res.status(500).json({ error: "Erro ao obter tarefas" });
  }
};

const createTask = async (req, res) => {
  try {
    const { titulo, categoria, responsavelNome } = req.body;

    if (!titulo || !categoria || !responsavelNome) {
      return res.status(400).json({ error: "Título, categoria e responsável são obrigatórios" });
    }

    const result = await taskService.createTask(titulo, categoria, responsavelNome);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await taskService.updateTask(id, updates);

    if (!result) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await taskService.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover tarefa:', error);
    res.status(500).json({ error: "Erro ao remover tarefa" });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const stats = await taskService.getTaskStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
