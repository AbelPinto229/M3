const taskService = require('../services/taskService');

const getTasks = (req, res) => {
  const { search, sort } = req.query;

  let result = taskService.getAllTasks();

  if (search) {
    result = taskService.searchTasks(search);
  }

  if (sort) {
    result = taskService.sortTasks(sort);
  } else if (search) {
    // Já está filtrado, não precisa sort padrão
  } else {
    result = taskService.sortTasks('asc');
  }

  res.json(result);
};

const createTask = (req, res) => {
  const { titulo, categoria, responsavelNome } = req.body;

  if (!titulo || !categoria || !responsavelNome) {
    return res.status(400).json({ error: "Título, categoria e responsável são obrigatórios" });
  }

  const result = taskService.createTask(titulo, categoria, responsavelNome);

  if (result.error) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const result = taskService.updateTask(id, updates);

  if (!result) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  if (result.error) {
    return res.status(400).json(result);
  }

  res.json(result);
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  const deleted = taskService.deleteTask(id);

  if (!deleted) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  res.status(204).send();
};

const getTaskStats = (req, res) => {
  const stats = taskService.getTaskStats();
  res.json(stats);
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
