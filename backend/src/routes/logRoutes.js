import express from 'express';
import * as logController from '../controllers/logController.js';

const router = express.Router();

router.post('/', logController.addLog);
router.get('/', logController.getLogs);
router.get('/count', logController.getLogCount);
router.delete('/', logController.clearLogs);

export default router;
