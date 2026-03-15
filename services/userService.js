let users = [
  { id: 1, nome: "João Silva", email: "joao@example.com", ativo: true },
  { id: 2, nome: "Maria Santos", email: "maria@example.com", ativo: true }
];

let nextId = 3;

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getAllUsers = () => users;

const getUserById = (id) => users.find(u => u.id === parseInt(id));

const createUser = (nome, email) => {
  if (!isValidEmail(email)) {
    return { error: "Email inválido" };
  }

  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    return { error: "Email já existe" };
  }

  const newUser = {
    id: nextId++,
    nome,
    email,
    ativo: true
  };

  users.push(newUser);
  return newUser;
};

const updateUser = (id, updates) => {
  const user = getUserById(id);
  if (!user) {
    return null;
  }

  if (updates.email && !isValidEmail(updates.email)) {
    return { error: "Email inválido" };
  }

  if (updates.email && updates.email !== user.email) {
    const emailExists = users.some(u => u.email === updates.email);
    if (emailExists) {
      return { error: "Email já existe" };
    }
  }

  Object.assign(user, updates);
  return user;
};

const deleteUser = (id) => {
  const initialLength = users.length;
  users = users.filter(u => u.id !== parseInt(id));
  return users.length < initialLength;
};

const toggleUserStatus = (id) => {
  const user = getUserById(id);
  if (!user) return null;

  user.ativo = !user.ativo;
  return user;
};

const getUserStats = () => {
  const total = users.length;
  const ativos = users.filter(u => u.ativo).length;
  const percentagem = total > 0 ? ((ativos / total) * 100).toFixed(2) : 0;

  return {
    total,
    ativos,
    percentagem: parseFloat(percentagem)
  };
};

const searchUsers = (searchTerm) => {
  return users.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const sortUsers = (order = 'asc') => {
  const sorted = [...users];
  return sorted.sort((a, b) => {
    if (order === 'desc') {
      return b.nome.localeCompare(a.nome);
    }
    return a.nome.localeCompare(b.nome);
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
  searchUsers,
  sortUsers
};
