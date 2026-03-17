import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";

const app = express();
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/tags", tagRoutes);

app.listen(3000, () => {
  console.log(`Servidor ClickUP API em http://localhost:3000`);
});