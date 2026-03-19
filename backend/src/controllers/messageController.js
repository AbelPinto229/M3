import * as messageService from "../services/messageService.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await messageService.getConversations(Number(req.params.userId));
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages(
      Number(req.params.userId),
      Number(req.params.otherUserId)
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;
    
    if (!sender_id || !receiver_id || !content?.trim()) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta' });
    }
    
    const message = await messageService.sendMessage(
      Number(sender_id),
      Number(receiver_id),
      content.trim()
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await messageService.getUnreadCount(Number(req.params.userId));
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
