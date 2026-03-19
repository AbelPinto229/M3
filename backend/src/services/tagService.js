import { db } from '../db.js';
import { getTasksByTag } from "./taskService.js";

export const getTags = async () => {
  const sql = 'SELECT * FROM tags';
  const [tags] = await db.query(sql);
  return tags;
}

export const createTag = async (data) => {
  console.log('📝 Criando tag na DB:', data);
  const sql = 'INSERT INTO tags (name) VALUES (?)';
  const [result] = await db.query(sql, [data.name || data.nome]);
  
  const newTag = {
    id: result.insertId,
    name: data.name || data.nome
  };
  
  console.log('✅ Tag criada na DB:', newTag);
  return newTag;
}

export const deleteTag = async (id) => {
  console.log('🗑️ Deletando tag ID:', id);
  const sql = 'DELETE FROM tags WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Tag não encontrada");
  }
  
  console.log('✅ Tag deletada com sucesso');
}

export const getTasksForTag = async (tagId) => {
  return await getTasksByTag(tagId);
}

