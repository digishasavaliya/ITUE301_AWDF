function validateTask(req, res, next) {
  const { title, priority, completed } = req.body;

  if (req.method === 'POST' && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean value' });
  }

  next();
}

module.exports = validateTask;
