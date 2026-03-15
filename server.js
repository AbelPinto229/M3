const express = require("express");
const userController = require("./controllers/userController");
const taskController = require("./controllers/taskController");
const { checkUserExists } = require("./middlewares/checkUserExists");

const app = express();

// Middleware
app.use(express.json());

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

app.listen(3000, () => {
  console.log("Servidor ClickUP API em http://localhost:3000");
});