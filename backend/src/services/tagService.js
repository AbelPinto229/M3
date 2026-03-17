import { getTasksByTag } from "./taskService.js";

let tags = [];
let id = 1;

export const getTags = () => {
  return tags;
}

export const createTag = (data) => {
  const newTag = { 
    id: id++, 
    nome: data.nome
  };
  tags.push(newTag);
  return newTag;
}

export const deleteTag = (id) => {
  const tag = tags.find(t => t.id === id);
  if (!tag) {
    throw new Error("Tag não encontrada");
  }
  tags = tags.filter(t => t.id !== id);
}

export const getTasksForTag = (tagId) => {
  return getTasksByTag(tagId);
}

