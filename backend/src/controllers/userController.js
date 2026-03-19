import * as userService from "../services/userService.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }
    
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    console.error('❌ Erro ao atualizar utilizador:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await userService.toggleUserStatus(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    console.log('🗑️ DELETE request recebido para user ID:', req.params.id);
    console.log('🗑️ req.user:', req.user);
    await userService.deleteUser(req.user.id);
    console.log('✅ Utilizador deletado com sucesso da DB');
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error('❌ Erro ao deletar utilizador:', error);
    res.status(500).json({ error: error.message });
  }
}

export const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
