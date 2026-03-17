let tasks = [];
let id = 1;
const taskTags = [];

export const getTasks = (query = {}) => {
  let result = [...tasks];
  
  // Filtro de busca
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    result = result.filter(t => 
      t.titulo.toLowerCase().includes(searchLower) ||
      t.categoria.toLowerCase().includes(searchLower) ||
      t.responsavelNome.toLowerCase().includes(searchLower)
    );
  }
  
  // Ordenação
  if (query.sort === 'asc') {
    result.sort((a, b) => a.titulo.localeCompare(b.titulo));
  } else if (query.sort === 'desc') {
    result.sort((a, b) => b.titulo.localeCompare(a.titulo));
  }
  
  return result;
}

export const createTask = (data) => {
  const newTask = { 
    id: id++, 
    titulo: data.titulo, 
    categoria: data.categoria,
    concluida: data.concluida ?? false,
    responsavelNome: data.responsavelNome,
    dataConclusao: data.dataConclusao ?? null
  };
  tasks.push(newTask);
  return newTask;
}

export const updateTask = (id, data) => {
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error("Tarefa não encontrada");
  } 
  task.titulo = data.titulo ?? task.titulo;
  task.categoria = data.categoria ?? task.categoria;
  task.concluida = data.concluida ?? task.concluida;
  task.responsavelNome = data.responsavelNome ?? task.responsavelNome;
  task.dataConclusao = data.dataConclusao ?? task.dataConclusao;
  return task;
}

export const deleteTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error("Tarefa não encontrada");
  }
  tasks = tasks.filter(t => t.id !== id);
}

export const getTaskStats = () => {
  const total = tasks.length;
  const concluidas = tasks.filter(t => t.concluida).length;
  const pendentes = tasks.filter(t => !t.concluida).length;
  
  return {
    total,
    pendentes,
    concluidas
  };
}

export const addTagToTask = (taskId, tagId) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error("Tarefa não encontrada");
  }
  
  // Verifica se a relação já existe
  const exists = taskTags.find(tt => tt.taskId === taskId && tt.tagId === tagId);
  if (exists) {
    throw new Error("Tag já associada a esta tarefa");
  }
  
  const relation = { taskId, tagId };
  taskTags.push(relation);
  return relation;
}

export const getTasksByTag = (tagId) => {
  // Busca todos os taskIds que têm essa tag
  const taskIds = taskTags
    .filter(tt => tt.tagId === tagId)
    .map(tt => tt.taskId);
  
  // Retorna as tarefas correspondentes
  return tasks.filter(t => taskIds.includes(t.id));
}
