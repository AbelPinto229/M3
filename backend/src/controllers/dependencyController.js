import { getDependencies, addDependency, removeDependency } from '../services/dependencyService.js';

export const getDependenciesHandler = async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    if (!taskId) return res.status(400).json({ error: 'taskId inválido' });
    const deps = await getDependencies(taskId);
    res.json(deps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addDependencyHandler = async (req, res) => {
  try {
    const { task_id, depends_on_id } = req.body;
    if (!task_id || !depends_on_id) return res.status(400).json({ error: 'task_id e depends_on_id são obrigatórios' });
    const dep = await addDependency(task_id, depends_on_id);
    res.status(201).json(dep);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Dependência já existe' });
    res.status(400).json({ error: err.message });
  }
};

export const removeDependencyHandler = async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const dependsOnId = parseInt(req.params.dependsOnId);
    if (!taskId || !dependsOnId) return res.status(400).json({ error: 'IDs inválidos' });
    await removeDependency(taskId, dependsOnId);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
