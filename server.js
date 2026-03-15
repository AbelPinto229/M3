const express = require("express");
const sequelize = require("./config/database");
const User = require("./models/User");
const Task = require("./models/Task");
const userController = require("./controllers/userController");
const taskController = require("./controllers/taskController");
const { checkUserExists } = require("./middlewares/checkUserExists");

const app = express();

// Middleware
app.use(express.json());

// Sincronizar modelos com banco de dados
sequelize.sync({ alter: true }).then(() => {
  console.log("Base de dados sincronizada com sucesso!");
}).catch(err => {
  console.error("Erro ao sincronizar base de dados:", err);
});

// Exercício 1 & 10 & 11: User Routes
app.get("/users", userController.getUsers);
app.get("/users/stats", userController.getUserStats);
app.post("/users", userController.createUser);
app.put("/users/:id", userController.updateUser);
app.patch("/users/:id", userController.toggleUserStatus);
app.delete("/users/:id", userController.deleteUser);
app.get("/users/:id", checkUserExists, (req, res) => {
  res.json(req.user);
});

// Exercício 6 & 10 & 11: Task Routes
app.get("/tasks", taskController.getTasks);
app.get("/tasks/stats", taskController.getTaskStats);
app.post("/tasks", taskController.createTask);
app.put("/tasks/:id", taskController.updateTask);
app.delete("/tasks/:id", taskController.deleteTask);

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ClickUP API em http://localhost:${PORT}`);
});