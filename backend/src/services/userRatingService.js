import { db } from '../db.js';

export const ensureTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      rated_by INT NOT NULL,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_rating (user_id, rated_by),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (rated_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Tabela user_ratings pronta');
};

export const rateUser = async (userId, ratedBy, rating) => {
  // Upsert: insert or update existing rating
  const sql = `
    INSERT INTO user_ratings (user_id, rated_by, rating) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = VALUES(rating)
  `;
  await db.query(sql, [userId, ratedBy, rating]);
  return getAverageRating(userId);
};

export const getAverageRating = async (userId) => {
  const [rows] = await db.query(
    'SELECT AVG(rating) as average, COUNT(*) as count FROM user_ratings WHERE user_id = ?',
    [userId]
  );
  return {
    average: parseFloat(rows[0].average) || 0,
    count: rows[0].count || 0
  };
};

export const getRatings = async (userId) => {
  const [rows] = await db.query(
    `SELECT ur.*, u.name AS rated_by_name 
     FROM user_ratings ur 
     JOIN users u ON u.id = ur.rated_by 
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows;
};
