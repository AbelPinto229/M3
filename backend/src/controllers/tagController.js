import * as tagService from "../services/tagService.js";

export const getTags = async (req, res) => {
  try {
    const tags = await tagService.getTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createTag = async (req, res) => {
  try {
    const tag = await tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteTag = async (req, res) => {
  try {
    await tagService.deleteTag(Number(req.params.id));
    res.json({ message: "Tag deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getTasksForTag = async (req, res) => {
  try {
    const tasks = await tagService.getTasksForTag(Number(req.params.id));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
