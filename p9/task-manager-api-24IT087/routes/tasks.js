const express = require('express');
const Task = require('../models/Task');
const validateContentType = require('../middleware/validateContentType');
const validateTaskId = require('../middleware/validateTaskId');
const validateTask = require('../middleware/validateTask');
const auth = require('../middleware/auth');
const cache = require('../config/cache');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const bypassCache = req.query.cache === 'false';
    const cacheKey = 'all_tasks';

    if (!bypassCache) {
      const cachedTasks = cache.safeGet(cacheKey);

      if (cachedTasks !== undefined) {
        cache.incrementHit();
        return res.status(200).json({ message: 'Tasks retrieved successfully', tasks: cachedTasks });
      }

      cache.incrementMiss();
    }

    const tasks = await Task.find().sort({ createdAt: -1 });

    if (!bypassCache) {
      cache.safeSet(cacheKey, tasks);
    }

    return res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateTaskId, async (req, res, next) => {
  try {
    const bypassCache = req.query.cache === 'false';
    const cacheKey = `task_${req.taskId}`;

    if (!bypassCache) {
      const cachedTask = cache.safeGet(cacheKey);

      if (cachedTask !== undefined) {
        cache.incrementHit();
        return res.status(200).json({ message: 'Task retrieved successfully', task: cachedTask });
      }

      cache.incrementMiss();
    }

    const task = await Task.findById(req.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!bypassCache) {
      cache.safeSet(cacheKey, task);
    }

    res.status(200).json({ message: 'Task retrieved successfully', task });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateContentType, validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const task = await Task.create({ title: title.trim(), description, completed, priority });
    cache.safeDel('all_tasks');
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'Invalid task data' });
    next(err);
  }
});

router.put('/:id', validateContentType, validateTaskId, validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;
    if (priority !== undefined) updates.priority = priority;

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid fields provided' });

    const task = await Task.findByIdAndUpdate(req.taskId, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    cache.safeDel(`task_${req.taskId}`);
    cache.safeDel('all_tasks');

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'Invalid task data' });
    next(err);
  }
});

router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    cache.safeDel(`task_${req.taskId}`);
    cache.safeDel('all_tasks');

    res.status(200).json({ message: 'Task deleted successfully', task });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
