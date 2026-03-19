import { db } from '../db.js';

export const ensureTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_watchers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      watcher_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_watcher (user_id, watcher_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (watcher_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Tabela user_watchers pronta');
};

export const watchUser = async (userId, watcherId) => {
  const sql = 'INSERT IGNORE INTO user_watchers (user_id, watcher_id) VALUES (?, ?)';
  await db.query(sql, [userId, watcherId]);
};

export const unwatchUser = async (userId, watcherId) => {
  const sql = 'DELETE FROM user_watchers WHERE user_id = ? AND watcher_id = ?';
  await db.query(sql, [userId, watcherId]);
};

export const getWatchers = async (userId) => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.photo 
     FROM user_watchers uw 
     JOIN users u ON u.id = uw.watcher_id 
     WHERE uw.user_id = ?`,
    [userId]
  );
  return rows;
};

export const getWatcherCount = async (userId) => {
  const [rows] = await db.query(
    'SELECT COUNT(*) as count FROM user_watchers WHERE user_id = ?',
    [userId]
  );
  return rows[0].count;
};

export const isWatching = async (userId, watcherId) => {
  const [rows] = await db.query(
    'SELECT 1 FROM user_watchers WHERE user_id = ? AND watcher_id = ?',
    [userId, watcherId]
  );
  return rows.length > 0;
};
