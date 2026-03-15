let tasks = [
  { id: 1, titulo: "Criar login", categoria: "trabalho", concluida: false, responsavelNome: "João Silva", dataConclusao: undefined },
  { id: 2, titulo: "Criar dashboard", categoria: "trabalho", concluida: false, responsavelNome: "Maria Santos", dataConclusao: undefined }
];

let nextId = 3;

const isValidTitle = (titulo) => titulo && titulo.length > 3;

const getAllTasks = () => tasks;

const getTaskById = (id) => tasks.find(t => t.id === parseInt(id));

const createTask = (titulo, categoria, responsavelNome) => {
  if (!isValidTitle(titulo)) {
    return { error: "Título deve ter mais de 3 caracteres" };
  }

  if (!responsavelNome || responsavelNome.trim() === "") {
    return { error: "Responsável não pode estar vazio" };
  }

  const newTask = {
    id: nextId++,
    titulo,
    categoria,
    concluida: false,
    responsavelNome,
    dataConclusao: undefined
  };

  tasks.push(newTask);
  return newTask;
};

const updateTask = (id, updates) => {
  const task = getTaskById(id);
  if (!task) {
    return null;
  }

  if (updates.titulo && !isValidTitle(updates.titulo)) {
    return { error: "Título deve ter mais de 3 caracteres" };
  }

  if (updates.responsavelNome && updates.responsavelNome.trim() === "") {
    return { error: "Responsável não pode estar vazio" };
  }

  // Atualizar dataConclusao baseado no status concluida
  if (updates.concluida !== undefined) {
    if (updates.concluida === true) {
      updates.dataConclusao = new Date().toISOString().split('T')[0];
    } else {
      updates.dataConclusao = undefined;
    }
  }

  Object.assign(task, updates);
  return task;
};

const deleteTask = (id) => {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== parseInt(id));
  return tasks.length < initialLength;
};

const getTaskStats = () => {
  const total = tasks.length;
  const pendentes = tasks.filter(t => !t.concluida).length;
  const concluidas = tasks.filter(t => t.concluida).length;

  return {
    total,
    pendentes,
    concluidas
  };
};

const searchTasks = (searchTerm) => {
  return tasks.filter(t =>
    t.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const sortTasks = (order = 'asc') => {
  const sorted = [...tasks];
  return sorted.sort((a, b) => {
    if (order === 'desc') {
      return b.titulo.localeCompare(a.titulo);
    }
    return a.titulo.localeCompare(b.titulo);
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  searchTasks,
  sortTasks
};
