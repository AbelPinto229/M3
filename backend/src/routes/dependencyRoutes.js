import express from 'express';
import { getDependenciesHandler, addDependencyHandler, removeDependencyHandler } from '../controllers/dependencyController.js';

const router = express.Router();

// GET /dependencies/:taskId — list dependencies of a task
router.get('/:taskId', getDependenciesHandler);

// POST /dependencies — { task_id, depends_on_id }
router.post('/', addDependencyHandler);

// DELETE /dependencies/:taskId/:dependsOnId
router.delete('/:taskId/:dependsOnId', removeDependencyHandler);

export default router;
