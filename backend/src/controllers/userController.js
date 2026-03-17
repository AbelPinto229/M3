import * as userService from "../services/userService.js";

export const getUsers = (req, res) => {
  const users = userService.getUsers(req.query);
  res.json(users);
}

export const createUser = (req, res) => {
  const user = userService.createUser(req.body);
  res.status(201).json(user);
}

export const updateUser = (req, res) => {
  const user = userService.updateUser(req.user.id, req.body);
  res.json(user);
}

export const toggleUserStatus = (req, res) => {
  const user = userService.toggleUserStatus(req.user.id);
  res.json(user);
}

export const deleteUser = (req, res) => {
  userService.deleteUser(req.user.id);
  res.json({ message: "Usuário deletado com sucesso" });
}

export const getUserStats = (req, res) => {
  const stats = userService.getUserStats();
  res.json(stats);
}
