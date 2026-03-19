import { db } from '../db.js';

export const createRating = async (data) => {
  console.log('📝 Criando rating na DB:', data);
  const sql = 'INSERT INTO ratings (task_id, user_id, rating_value) VALUES (?, ?, ?)';
  const [result] = await db.query(sql, [
    data.task_id || data.taskId,
    data.user_id || data.userId,
    data.rating_value || data.ratingValue || data.rating
  ]);
  
  const newRating = {
    id: result.insertId,
    task_id: data.task_id || data.taskId,
    user_id: data.user_id || data.userId,
    rating_value: data.rating_value || data.ratingValue || data.rating
  };
  
  console.log('✅ Rating criado na DB:', newRating);
  return newRating;
}

export const getRatingsByTask = async (taskId) => {
  console.log('🔍 Buscando ratings da tarefa', taskId);
  const sql = 'SELECT * FROM ratings WHERE task_id = ?';
  const [ratings] = await db.query(sql, [taskId]);
  console.log('✅ Ratings encontrados:', ratings.length);
  return ratings;
}

export const getRatingsByUser = async (userId) => {
  const sql = 'SELECT * FROM ratings WHERE user_id = ?';
  const [ratings] = await db.query(sql, [userId]);
  return ratings;
}

export const deleteRating = async (id) => {
  console.log('🗑️ Deletando rating ID:', id);
  const sql = 'DELETE FROM ratings WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Rating não encontrado");
  }
  
  console.log('✅ Rating deletado com sucesso');
}

export const getAverageRating = async (taskId) => {
  const sql = 'SELECT AVG(rating_value) as average, COUNT(*) as count FROM ratings WHERE task_id = ?';
  const [result] = await db.query(sql, [taskId]);
  return {
    average: result[0].average || 0,
    count: result[0].count || 0
  };
}
