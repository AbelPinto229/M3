import { db } from '../db.js';

// Ensure messages table exists
export const ensureTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      content TEXT NOT NULL,
      read_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

// Get all conversations for a user (latest message per contact)
export const getConversations = async (userId) => {
  const [rows] = await db.query(`
    SELECT 
      u.id, u.name, u.email, u.role, u.active, u.photo,
      m.content AS lastMessage,
      m.created_at AS lastMessageAt,
      m.sender_id AS lastSenderId,
      (SELECT COUNT(*) FROM messages WHERE sender_id = u.id AND receiver_id = ? AND read_at IS NULL) AS unread
    FROM users u
    INNER JOIN (
      SELECT 
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS contact_id,
        MAX(id) AS max_id
      FROM messages
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY contact_id
    ) latest ON u.id = latest.contact_id
    INNER JOIN messages m ON m.id = latest.max_id
    ORDER BY m.created_at DESC
  `, [userId, userId, userId, userId]);
  return rows;
};

// Get messages between two users
export const getMessages = async (userId, otherUserId) => {
  const [rows] = await db.query(`
    SELECT m.*, 
      s.name AS sender_name, 
      r.name AS receiver_name
    FROM messages m
    JOIN users s ON s.id = m.sender_id
    JOIN users r ON r.id = m.receiver_id
    WHERE (m.sender_id = ? AND m.receiver_id = ?) 
       OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at ASC
  `, [userId, otherUserId, otherUserId, userId]);
  
  // Mark as read
  await db.query(
    'UPDATE messages SET read_at = NOW() WHERE sender_id = ? AND receiver_id = ? AND read_at IS NULL',
    [otherUserId, userId]
  );
  
  return rows;
};

// Send a message
export const sendMessage = async (senderId, receiverId, content) => {
  const [result] = await db.query(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [senderId, receiverId, content]
  );
  
  const [rows] = await db.query('SELECT m.*, s.name AS sender_name, r.name AS receiver_name FROM messages m JOIN users s ON s.id = m.sender_id JOIN users r ON r.id = m.receiver_id WHERE m.id = ?', [result.insertId]);
  return rows[0];
};

// Get total unread count for a user
export const getUnreadCount = async (userId) => {
  const [rows] = await db.query(
    'SELECT COUNT(*) AS count FROM messages WHERE receiver_id = ? AND read_at IS NULL',
    [userId]
  );
  return rows[0].count;
};
