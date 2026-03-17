const comments = [];
let id = 1;

export const createComment = (data) => {
  const newComment = {
    id: id++,
    taskId: data.taskId,
    userId: data.userId,
    conteudo: data.conteudo,
    dataCriacao: new Date().toISOString()
  };
  comments.push(newComment);
  return newComment;
}

export const getCommentsByTask = (taskId) => {
  return comments
    .filter(c => c.taskId === taskId)
    .sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
}
