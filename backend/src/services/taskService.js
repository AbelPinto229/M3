import { db } from '../db.js';

export const getTasks = async (query = {}) => {
  let sql = 'SELECT * FROM tasks';
  
  // Search filter
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    sql += ` WHERE LOWER(title) LIKE '%${searchLower}%' OR LOWER(type) LIKE '%${searchLower}%'`;
  }
  
  // Sort
  if (query.sort === 'asc') {
    sql += ' ORDER BY title ASC';
  } else if (query.sort === 'desc') {
    sql += ' ORDER BY title DESC';
  }
  
  const [tasks] = await db.query(sql);
  return tasks;
}

export const createTask = async (data) => {
  console.log('📝 Criando tarefa na DB:', data);
  const sql = 'INSERT INTO tasks (title, description, type, status, priority, deadline) VALUES (?, ?, ?, ?, ?, ?)';
  const [result] = await db.query(sql, [
    data.title,
    data.description || null,
    data.type,
    data.status || 'CREATED',
    data.priority || 'MEDIUM',
    data.deadline || null
  ]);
  
  const newTask = {
    id: result.insertId,
    title: data.title,
    description: data.description || null,
    type: data.type,
    status: data.status || 'CREATED',
    priority: data.priority || 'MEDIUM',
    deadline: data.deadline || null
  };
  
  console.log('✅ Tarefa criada na DB:', newTask);
  return newTask;
}

export const updateTask = async (id, data) => {
  console.log('📝 Atualizando tarefa ID:', id, 'Data:', data);
  
  // Construir UPDATE dinamicamente apenas com campos fornecidos
  const fields = [];
  const values = [];
  
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.type !== undefined) {
    fields.push('type = ?');
    values.push(data.type);
  }
  if (data.status !== undefined) {
    fields.push('status = ?');
    values.push(data.status);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.priority !== undefined) {
    fields.push('priority = ?');
    values.push(data.priority);
  }
  if (data.deadline !== undefined) {
    fields.push('deadline = ?');
    values.push(data.deadline);
  }
  
  if (fields.length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }
  
  values.push(id);
  const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  console.log('📝 SQL:', sql, 'Values:', values);
  
  const [result] = await db.query(sql, values);
  
  if (result.affectedRows === 0) {
    throw new Error("Tarefa não encontrada");
  }
  
  const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  console.log('✅ Tarefa atualizada:', tasks[0]);
  return tasks[0];
}

export const deleteTask = async (id) => {
  console.log('🔥 Executando DELETE task na DB para ID:', id);
  const sql = 'DELETE FROM tasks WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  
  console.log('📊 Resultado do DELETE task:', result);
  console.log('📊 Linhas afetadas:', result.affectedRows);
  
  if (result.affectedRows === 0) {
    throw new Error("Tarefa não encontrada");
  }
  
  console.log('✅ DELETE task executado com sucesso');
}

export const getTaskStats = async () => {
  const [stats] = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN concluida = 1 THEN 1 ELSE 0 END) as concluidas,
      SUM(CASE WHEN concluida = 0 THEN 1 ELSE 0 END) as pendentes
    FROM tasks
  `);
  
  return {
    total: stats[0].total || 0,
    pendentes: stats[0].pendentes || 0,
    concluidas: stats[0].concluidas || 0
  };
}

export const addTagToTask = async (taskId, tagId) => {
  // Check if task exists
  const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (tasks.length === 0) {
    throw new Error("Tarefa não encontrada");
  }
  
  // Check if relationship already exists
  const [exists] = await db.query('SELECT * FROM task_tags WHERE task_id = ? AND tag_id = ?', [taskId, tagId]);
  if (exists.length > 0) {
    throw new Error("Tag já associada a esta tarefa");
  }
  
  console.log('📝 Associando tag', tagId, 'à tarefa', taskId);
  const sql = 'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)';
  const [result] = await db.query(sql, [taskId, tagId]);
  
  // Buscar o nome da tag
  const [tagInfo] = await db.query(
    'SELECT tt.id, tt.task_id, tt.tag_id, t.name as tag_name FROM task_tags tt INNER JOIN tags t ON tt.tag_id = t.id WHERE tt.id = ?',
    [result.insertId]
  );
  
  console.log('✅ Tag associada com sucesso:', tagInfo[0]);
  return tagInfo[0];
}

export const getTasksByTag = async (tagId) => {
  const sql = `
    SELECT t.* FROM tasks t
    INNER JOIN task_tags tt ON t.id = tt.task_id
    WHERE tt.tag_id = ?
  `;
  const [tasks] = await db.query(sql, [tagId]);
  return tasks;
}

export const getTagsForTask = async (taskId) => {
  console.log('🔍 Buscando tags da tarefa', taskId);
  const sql = `
    SELECT tt.id, tt.task_id, tt.tag_id, t.name as tag_name
    FROM task_tags tt
    INNER JOIN tags t ON tt.tag_id = t.id
    WHERE tt.task_id = ?
  `;
  const [tags] = await db.query(sql, [taskId]);
  console.log('✅ Tags encontradas:', tags.length);
  return tags;
}
