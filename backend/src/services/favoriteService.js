import { db } from '../db.js';

export const getFavoritesByUser = async (userId) => {
  const sql = 'SELECT * FROM favorites WHERE user_id = ?';
  const [favorites] = await db.query(sql, [userId]);
  return favorites;
}

export const addFavorite = async (data) => {
  console.log('📝 Adicionando favorito:', data);
  
  // Check if already exists
  const [exists] = await db.query('SELECT * FROM favorites WHERE user_id = ? AND task_id = ?', [data.user_id, data.task_id]);
  if (exists.length > 0) {
    console.log('⚠️ Favorito já existe');
    return exists[0];
  }
  
  const sql = 'INSERT INTO favorites (user_id, task_id) VALUES (?, ?)';
  const [result] = await db.query(sql, [data.user_id, data.task_id]);
  
  const newFavorite = {
    id: result.insertId,
    user_id: data.user_id,
    task_id: data.task_id,
    created_at: new Date().toISOString()
  };
  
  console.log('✅ Favorito adicionado:', newFavorite);
  return newFavorite;
}

export const removeFavorite = async (userId, taskId) => {
  console.log('🗑️ Removendo favorito:', userId, taskId);
  const sql = 'DELETE FROM favorites WHERE user_id = ? AND task_id = ?';
  const [result] = await db.query(sql, [userId, taskId]);
  
  if (result.affectedRows === 0) {
    throw new Error("Favorito não encontrado");
  }
  
  console.log('✅ Favorito removido');
}
