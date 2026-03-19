import * as userWatcherService from "../services/userWatcherService.js";

export const watchUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { watcher_id } = req.body;
    if (!watcher_id) return res.status(400).json({ error: 'watcher_id obrigatório' });
    await userWatcherService.watchUser(userId, Number(watcher_id));
    res.json({ message: 'A seguir utilizador' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unwatchUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const watcherId = Number(req.params.watcherId);
    await userWatcherService.unwatchUser(userId, watcherId);
    res.json({ message: 'Deixou de seguir' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWatchers = async (req, res) => {
  try {
    const watchers = await userWatcherService.getWatchers(Number(req.params.userId));
    res.json(watchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWatcherCount = async (req, res) => {
  try {
    const count = await userWatcherService.getWatcherCount(Number(req.params.userId));
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const isWatching = async (req, res) => {
  try {
    const watching = await userWatcherService.isWatching(
      Number(req.params.userId),
      Number(req.params.watcherId)
    );
    res.json({ watching });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
