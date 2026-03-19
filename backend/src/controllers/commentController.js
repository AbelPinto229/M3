import * as commentService from "../services/commentService.js";

export const getCommentsByTask = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTask(Number(req.params.id));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createComment = async (req, res) => {
  try {    console.log('📝 Recebendo request para criar comentário:', req.body);
    const commentData = {
      task_id: Number(req.params.id),
      user_id: req.body.user_id || req.body.userId,
      message: req.body.message || req.body.conteudo
    };
    console.log('📝 Dados do comentário processados:', commentData);
    const comment = await commentService.createComment(commentData);
    res.status(201).json(comment);
  } catch (error) {
    console.error('❌ Erro ao criar comentário:', error);
    res.status(500).json({ error: error.message });
  }
}
