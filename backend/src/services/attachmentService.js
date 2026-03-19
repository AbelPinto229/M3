import { db } from '../db.js';

export const createAttachment = async (data) => {
  console.log('📝 Criando attachment na DB:', { taskId: data.task_id, filename: data.filename, size: data.file_size });
  const sql = 'INSERT INTO attachments (task_id, filename, file_url, file_size, uploaded_at) VALUES (?, ?, ?, ?, NOW())';
  const [result] = await db.query(sql, [
    data.task_id || data.taskId,
    data.filename,
    data.file_url || data.fileUrl || data.url,
    data.file_size || data.fileSize || data.size
  ]);
  
  const newAttachment = {
    id: result.insertId,
    task_id: data.task_id || data.taskId,
    filename: data.filename,
    file_url: data.file_url || data.fileUrl || data.url,
    file_size: data.file_size || data.fileSize || data.size,
    uploaded_at: new Date().toISOString()
  };
  
  console.log('✅ Attachment criado na DB:', newAttachment);
  return newAttachment;
}

export const getAttachmentsByTask = async (taskId) => {
  console.log('🔍 Buscando attachments da tarefa', taskId);
  const sql = 'SELECT * FROM attachments WHERE task_id = ?';
  const [attachments] = await db.query(sql, [taskId]);
  console.log('✅ Attachments encontrados:', attachments.length);
  return attachments;
}

export const deleteAttachment = async (id) => {
  console.log('🗑️ Deletando attachment ID:', id);
  const sql = 'DELETE FROM attachments WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Attachment não encontrado");
  }
  
  console.log('✅ Attachment deletado com sucesso');
}
