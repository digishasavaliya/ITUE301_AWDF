const express = require('express');
const Task = require('../models/Task');
const validateContentType = require('../middleware/validateContentType');
const validateTaskId = require('../middleware/validateTaskId');

const router = express.Router();

// GET /tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id
router.get('/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task retrieved successfully',
      task,
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks
router.post('/', validateContentType, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      completed,
      priority,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid task data' });
    }

    next(err);
  }
});

// PUT /tasks/:id
router.put('/:id', validateContentType, validateTaskId, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean value' });
      }
      updates.completed = completed;
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
      }
      updates.priority = priority;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided' });
    }

    const task = await Task.findByIdAndUpdate(req.taskId, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid task data' });
    }

    next(err);
  }
});

// DELETE /tasks/:id
router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
