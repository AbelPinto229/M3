import { db } from '../db.js';

export const getUsers = async (query = {}) => {
  let sql = 'SELECT * FROM users';
  
  // Search filter
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    sql += ` WHERE LOWER(name) LIKE '%${searchLower}%' OR LOWER(email) LIKE '%${searchLower}%'`;
  }
  
  // Sort
  if (query.sort === 'asc') {
    sql += ' ORDER BY name ASC';
  } else if (query.sort === 'desc') {
    sql += ' ORDER BY name DESC';
  }
  
  const [users] = await db.query(sql);
  return users;
}

export const createUser = async (data) => {
  console.log('📝 Criando utilizador na DB:', data);
  const sql = 'INSERT INTO users (name, email, role, active, photo) VALUES (?, ?, ?, ?, ?)';
  const [result] = await db.query(sql, [
    data.name, 
    data.email, 
    data.role || 'MEMBER',
    data.active ?? true,
    data.photo || null
  ]);
  
  const newUser = {
    id: result.insertId,
    name: data.name,
    email: data.email,
    role: data.role || 'MEMBER',
    active: data.active ?? true,
    photo: data.photo || null
  };
  
  console.log('✅ Utilizador criado na DB:', newUser);
  return newUser;
}

export const updateUser = async (id, data) => {
  const sql = 'UPDATE users SET name = ?, email = ?, active = ? WHERE id = ?';
  const [result] = await db.query(sql, [data.name ?? null, data.email ?? null, data.active ?? null, id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Utilizador não encontrado");
  }
  
  return await getUserById(id);
}

export const toggleUserStatus = async (id) => {
  const user = await getUserById(id);
  const sql = 'UPDATE users SET active = ? WHERE id = ?';
  await db.query(sql, [!user.active, id]);
  
  return await getUserById(id);
}

export const deleteUser = async (id) => {
  console.log('🔥 Executando DELETE na DB para ID:', id);
  const sql = 'DELETE FROM users WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  
  console.log('📊 Resultado do DELETE:', result);
  console.log('📊 Linhas afetadas:', result.affectedRows);
  
  if (result.affectedRows === 0) {
    throw new Error("Utilizador não encontrado");
  }
  
  console.log('✅ DELETE executado com sucesso');
}

export const getUserStats = async () => {
  const [stats] = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as ativos
    FROM users
  `);
  
  const total = stats[0].total || 0;
  const ativos = stats[0].ativos || 0;
  const percentagemAtivos = total > 0 ? ((ativos / total) * 100).toFixed(2) : 0;
  
  return {
    total,
    ativos,
    percentagemAtivos: `${percentagemAtivos}%`
  };
}

export const getUserById = async (id) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const [users] = await db.query(sql, [id]);
  
  if (users.length === 0) {
    throw new Error("Utilizador não encontrado");
  }
  
  return users[0];
}
