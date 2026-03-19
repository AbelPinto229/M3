import * as taskService from "../services/taskService.js";


export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(Number(req.params.id));
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getTaskStats = async (req, res) => {
  try {
    const stats = await taskService.getTaskStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const addTagToTask = async (req, res) => {
  try {
    const relation = await taskService.addTagToTask(Number(req.params.id), req.body.tagId);
    res.status(201).json(relation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getTagsForTask = async (req, res) => {
  try {
    const tags = await taskService.getTagsForTask(Number(req.params.id));
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
