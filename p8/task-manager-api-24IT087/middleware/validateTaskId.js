const mongoose = require('mongoose');

function validateTaskId(req, res, next) {
  const taskId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  req.taskId = taskId;
  next();
}

module.exports = validateTaskId;
