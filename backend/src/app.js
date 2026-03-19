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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ClickUP API em http://localhost:${PORT}`));
