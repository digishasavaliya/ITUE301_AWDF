function validateTaskId(req, res, next) {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Invalid Task ID' });
  }

  req.taskId = taskId;
  next();
}

module.exports = validateTaskId;
