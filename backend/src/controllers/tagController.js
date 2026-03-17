import * as tagService from "../services/tagService.js";

export const getTags = (req, res) => {
  const tags = tagService.getTags();
  res.json(tags);
}

export const createTag = (req, res) => {
  const tag = tagService.createTag(req.body);
  res.status(201).json(tag);
}

export const deleteTag = (req, res) => {
  tagService.deleteTag(Number(req.params.id));
  res.json({ message: "Tag deletada com sucesso" });
}

export const getTasksForTag = (req, res) => {
  const tasks = tagService.getTasksForTag(Number(req.params.id));
  res.json(tasks);
}
