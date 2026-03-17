import * as commentService from "../services/commentService.js";

export const getCommentsByTask = (req, res) => {
  const comments = commentService.getCommentsByTask(Number(req.params.id));
  res.json(comments);
}

export const createComment = (req, res) => {
  const commentData = {
    taskId: Number(req.params.id),
    userId: req.body.userId,
    conteudo: req.body.conteudo
  };
  const comment = commentService.createComment(commentData);
  res.status(201).json(comment);
}
