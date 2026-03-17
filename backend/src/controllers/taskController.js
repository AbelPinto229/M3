import * as taskService from "../services/taskService.js";


export const getTasks = (req, res) => {
  const tasks = taskService.getTasks(req.query);
  res.json(tasks);
}

export const createTask = (req, res) => {
  const task =  taskService.createTask(req.body);
  res.status(201).json(task);
}

export const updateTask = (req, res) => {
  try {
    const task = taskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export const deleteTask = (req, res) => {
  try {
    taskService.deleteTask(Number(req.params.id));
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export const getTaskStats = (req, res) => {
  const stats = taskService.getTaskStats();
  res.json(stats);
}

export const addTagToTask = (req, res) => {
  try {
    const relation = taskService.addTagToTask(Number(req.params.id), req.body.tagId);
    res.status(201).json(relation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
