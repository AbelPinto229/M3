import { db } from '../db.js';

export const createComment = async (data) => {
  console.log('📝 Criando comentário na DB:', data);
  const sql = 'INSERT INTO comments (task_id, user_id, message, created_at) VALUES (?, ?, ?, NOW())';
  const [result] = await db.query(sql, [
    data.task_id || data.taskId,
    data.user_id || data.userId,
    data.message || data.conteudo
  ]);
  
  const newComment = {
    id: result.insertId,
    task_id: data.task_id || data.taskId,
    user_id: data.user_id || data.userId,
    message: data.message || data.conteudo,
    created_at: new Date().toISOString()
  };
  
  console.log('✅ Comentário criado na DB:', newComment);
  return newComment;
}

export const getCommentsByTask = async (taskId) => {
  const sql = 'SELECT * FROM comments WHERE task_id = ? ORDER BY created_at ASC';
  const [comments] = await db.query(sql, [taskId]);
  return comments;
}

export const deleteComment = async (id) => {
  console.log('🗑️ Deletando comentário ID:', id);
  const sql = 'DELETE FROM comments WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }
  
  console.log('✅ Comentário deletado com sucesso');
}
