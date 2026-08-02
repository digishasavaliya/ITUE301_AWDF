const express = require('express');
const validateContentType = require('../middleware/validateContentType');
const validateTaskId = require('../middleware/validateTaskId');

const router = express.Router();

// In-memory storage for tasks.
let tasks = [];
let nextTaskId = 1;

// GET /tasks
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Tasks retrieved successfully',
    tasks,
  });
});

// GET /tasks/:id
router.get('/:id', validateTaskId, (req, res) => {
  const taskId = req.taskId;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({
    message: 'Task retrieved successfully',
    task,
  });
});

// POST /tasks
router.post('/', validateContentType, (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Title is required and must be a non-empty string',
    });
  }

  const newTask = {
    id: nextTaskId++,
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json({
    message: 'Task created successfully',
    task: newTask,
  });
});

// PUT /tasks/:id
router.put('/:id', validateContentType, validateTaskId, (req, res) => {
  const taskId = req.taskId;
  const { title, completed } = req.body;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        error: 'Title must be a non-empty string',
      });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        error: 'Completed must be a boolean value',
      });
    }
    task.completed = completed;
  }

  res.status(200).json({
    message: 'Task updated successfully',
    task,
  });
});

// DELETE /tasks/:id
router.delete('/:id', validateTaskId, (req, res) => {
  const taskId = req.taskId;
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: 'Task deleted successfully',
    task: deletedTask,
  });
});

module.exports = router;
