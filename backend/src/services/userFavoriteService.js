import { db } from '../db.js';

export const ensureTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      favorite_user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_fav (user_id, favorite_user_id)
    )
  `);
};

export const getFavoritesByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT uf.favorite_user_id, u.id, u.name, u.email, u.role, u.active, u.photo, u.vip_level
     FROM user_favorites uf
     JOIN users u ON u.id = uf.favorite_user_id
     WHERE uf.user_id = ?`,
    [userId]
  );
  return rows;
};

export const addFavorite = async (userId, favoriteUserId) => {
  await db.query(
    'INSERT INTO user_favorites (user_id, favorite_user_id) VALUES (?, ?)',
    [userId, favoriteUserId]
  );
};

export const removeFavorite = async (userId, favoriteUserId) => {
  await db.query(
    'DELETE FROM user_favorites WHERE user_id = ? AND favorite_user_id = ?',
    [userId, favoriteUserId]
  );
};

export const isFavorite = async (userId, favoriteUserId) => {
  const [rows] = await db.query(
    'SELECT 1 FROM user_favorites WHERE user_id = ? AND favorite_user_id = ?',
    [userId, favoriteUserId]
  );
  return rows.length > 0;
};
