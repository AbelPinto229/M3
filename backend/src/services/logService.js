import { db } from '../db.js';

export const ensureTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS system_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message VARCHAR(500) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const addLog = async (message) => {
  const [result] = await db.query(
    'INSERT INTO system_logs (message) VALUES (?)',
    [message]
  );
  return { id: result.insertId, message, created_at: new Date() };
};

export const getLogs = async () => {
  const [rows] = await db.query('SELECT * FROM system_logs ORDER BY created_at ASC');
  return rows;
};

export const getLogCount = async () => {
  const [rows] = await db.query('SELECT COUNT(*) as count FROM system_logs');
  return rows[0].count;
};

export const clearLogs = async () => {
  await db.query('DELETE FROM system_logs');
};
