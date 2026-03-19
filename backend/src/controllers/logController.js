import * as logService from '../services/logService.js';

export const addLog = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message obrigatório' });
    const log = await logService.addLog(message);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const logs = await logService.getLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLogCount = async (req, res) => {
  try {
    const count = await logService.getLogCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearLogs = async (req, res) => {
  try {
    await logService.clearLogs();
    res.json({ message: 'Logs limpos' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
