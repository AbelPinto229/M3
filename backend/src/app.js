import dotenv from "dotenv"
import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";

dotenv/config();

const app = express();
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/tags", tagRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ClickUP API em http://localhost:${PORT}`));
