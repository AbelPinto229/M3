let users = [];
let id = 1;

export const getUsers = (query = {}) => {
  let result = [...users];
  
  // Filtro de busca
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    result = result.filter(u => 
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Ordenação
  if (query.sort === 'asc') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (query.sort === 'desc') {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }
  
  return result;
}

export const createUser = (data) => {
  const newUser = { 
    id: id++, 
    name: data.name,
    email: data.email,
    active: data.active ?? true
  };
  users.push(newUser);
  return newUser;
}

export const updateUser = (id, data) => {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  user.name = data.name ?? user.name;
  user.email = data.email ?? user.email;
  user.active = data.active ?? user.active;
  return user;
}

export const toggleUserStatus = (id) => {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  user.active = !user.active;
  return user;
}

export const deleteUser = (id) => {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  users = users.filter(u => u.id !== id);
}

export const getUserStats = () => {
  const total = users.length;
  const ativos = users.filter(u => u.active).length;
  const percentagemAtivos = total > 0 ? ((ativos / total) * 100).toFixed(2) : 0;
  
  return {
    total,
    ativos,
    percentagemAtivos: `${percentagemAtivos}%`
  };
}

export const getUserById = (id) => {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  return user;
}
