import { db } from '../db.js';

// Get all dependencies for a task
export const getDependencies = async (taskId) => {
  const sql = `
    SELECT t.id, t.title, t.status, t.priority
    FROM task_dependencies td
    JOIN tasks t ON t.id = td.depends_on_id
    WHERE td.task_id = ?
  `;
  const [rows] = await db.query(sql, [taskId]);
  return rows;
};

// Add a dependency: taskId depends on dependsOnId
export const addDependency = async (taskId, dependsOnId) => {
  if (taskId === dependsOnId) throw new Error('Uma tarefa não pode depender de si mesma');
  const sql = 'INSERT INTO task_dependencies (task_id, depends_on_id) VALUES (?, ?)';
  const [result] = await db.query(sql, [taskId, dependsOnId]);
  return { id: result.insertId, task_id: taskId, depends_on_id: dependsOnId };
};

// Remove a dependency
export const removeDependency = async (taskId, dependsOnId) => {
  const sql = 'DELETE FROM task_dependencies WHERE task_id = ? AND depends_on_id = ?';
  const [result] = await db.query(sql, [taskId, dependsOnId]);
  if (result.affectedRows === 0) throw new Error('Dependência não encontrada');
};
