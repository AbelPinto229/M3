import 'dotenv/config';
import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import attachmentRoutes from "./routes/attachmentRoutes.js";
import dependencyRoutes from "./routes/dependencyRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRatingRoutes from "./routes/userRatingRoutes.js";
import userWatcherRoutes from "./routes/userWatcherRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import userFavoriteRoutes from "./routes/userFavoriteRoutes.js";
import { ensureTable as ensureMessagesTable } from "./services/messageService.js";
import { ensureTable as ensureUserRatingsTable } from "./services/userRatingService.js";
import { ensureTable as ensureUserWatchersTable } from "./services/userWatcherService.js";
import { ensureTable as ensureLogsTable } from "./services/logService.js";
import { ensureTable as ensureUserFavoritesTable } from "./services/userFavoriteService.js";

const app = express();

// Habilitar CORS para permitir requisições do frontend
app.use(cors());
app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body ? `Body: ${JSON.stringify(req.body)}` : '');
  next();
});

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/tags", tagRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/ratings", ratingRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/attachments", attachmentRoutes);
app.use("/dependencies", dependencyRoutes);
app.use("/messages", messageRoutes);
app.use("/user-ratings", userRatingRoutes);
app.use("/user-watchers", userWatcherRoutes);
app.use("/logs", logRoutes);
app.use("/user-favorites", userFavoriteRoutes);

// Ensure DB tables exist
ensureMessagesTable().catch(err => console.error('⚠️ Erro ao criar tabela messages:', err.message));
ensureUserRatingsTable().catch(err => console.error('⚠️ Erro ao criar tabela user_ratings:', err.message));
ensureUserWatchersTable().catch(err => console.error('⚠️ Erro ao criar tabela user_watchers:', err.message));
ensureLogsTable().catch(err => console.error('⚠️ Erro ao criar tabela system_logs:', err.message));
ensureUserFavoritesTable().catch(err => console.error('⚠️ Erro ao criar tabela user_favorites:', err.message));

// Ensure vip_level column exists in users table
import { db } from './db.js';
db.query('ALTER TABLE users ADD COLUMN vip_level INT DEFAULT 0').catch((err) => {
  // Error 1060 = Duplicate column name (column already exists) - safe to ignore
  if (err.errno !== 1060) console.error('⚠️ Erro ao adicionar coluna vip_level:', err.message);
});

// Ensure CRITICAL priority exists in tasks table enum
db.query("ALTER TABLE tasks MODIFY COLUMN priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM'").catch((err) => {
  console.error('⚠️ Erro ao atualizar ENUM priority (pode já estar atualizado):', err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ClickUP API em http://localhost:${PORT}`));
