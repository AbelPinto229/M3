import { db } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clickup_secret_key_2026';

export const loginUser = async (email, password) => {
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (users.length === 0) {
    throw new Error('Email ou password incorretos');
  }
  
  const user = users[0];
  
  if (!user.active) {
    throw new Error('Conta desativada. Contacte o administrador.');
  }
  
  if (!user.password) {
    throw new Error('Password não definida. Execute a migração de passwords.');
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Email ou password incorretos');
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      photo: user.photo
    }
  };
};

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
  
  // Auto-generate password: first name (lowercase) + "123"
  const firstName = data.name.trim().split(/\s+/)[0].toLowerCase();
  const autoPassword = firstName + '123';
  const hashedPassword = await bcrypt.hash(autoPassword, 10);
  
  const sql = 'INSERT INTO users (name, email, role, active, photo, password) VALUES (?, ?, ?, ?, ?, ?)';
  const [result] = await db.query(sql, [
    data.name, 
    data.email, 
    data.role || 'MEMBER',
    data.active ?? true,
    data.photo || null,
    hashedPassword
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
  // Build dynamic UPDATE with only provided fields
  const fields = [];
  const values = [];
  
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
  if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active); }
  if (data.role !== undefined) { fields.push('role = ?'); values.push(data.role); }
  if (data.photo !== undefined) { fields.push('photo = ?'); values.push(data.photo); }
  if (data.vip_level !== undefined) { fields.push('vip_level = ?'); values.push(data.vip_level); }
  
  if (fields.length === 0) return await getUserById(id);
  
  values.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await db.query(sql, values);
  
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
