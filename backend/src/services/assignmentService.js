import { db } from '../db.js';

export const assignUserToTask = async (taskId, userId) => {
  console.log('📝 Atribuindo user', userId, 'à tarefa', taskId);
  
  // Check if assignment already exists
  const [exists] = await db.query(
    'SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?',
    [taskId, userId]
  );
  
  if (exists.length > 0) {
    console.log('⚠️ Atribuição já existe');
    return exists[0];
  }
  
  const sql = 'INSERT INTO task_assignments (task_id, user_id, assigned_at) VALUES (?, ?, NOW())';
  const [result] = await db.query(sql, [taskId, userId]);
  
  const newAssignment = {
    id: result.insertId,
    task_id: taskId,
    user_id: userId,
    assigned_at: new Date().toISOString()
  };
  
  console.log('✅ Atribuição criada:', newAssignment);
  return newAssignment;
}

export const getAssignmentsByTask = async (taskId) => {
  console.log('🔍 Buscando atribuições da tarefa', taskId);
  const sql = `
    SELECT ta.*, u.name, u.email 
    FROM task_assignments ta
    INNER JOIN users u ON ta.user_id = u.id
    WHERE ta.task_id = ?
  `;
  const [assignments] = await db.query(sql, [taskId]);
  console.log('✅ Atribuições encontradas:', assignments.length);
  return assignments;
}

export const getAssignmentsByUser = async (userId) => {
  const sql = `
    SELECT ta.*, t.title, t.type, t.status
    FROM task_assignments ta
    INNER JOIN tasks t ON ta.task_id = t.id
    WHERE ta.user_id = ?
  `;
  const [assignments] = await db.query(sql, [userId]);
  return assignments;
}

export const removeAssignment = async (taskId, userId) => {
  console.log('🗑️ Removendo atribuição: task', taskId, 'user', userId);
  const sql = 'DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?';
  const [result] = await db.query(sql, [taskId, userId]);
  
  if (result.affectedRows === 0) {
    throw new Error("Atribuição não encontrada");
  }
  
  console.log('✅ Atribuição removida com sucesso');
}

export const clearTaskAssignments = async (taskId) => {
  console.log('🗑️ Limpando todas as atribuições da tarefa', taskId);
  const sql = 'DELETE FROM task_assignments WHERE task_id = ?';
  await db.query(sql, [taskId]);
  console.log('✅ Atribuições limpas');
}
