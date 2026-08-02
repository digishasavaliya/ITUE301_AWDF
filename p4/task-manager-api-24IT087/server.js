const express = require('express');
const logger = require('./middleware/logger');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = 5000;

// Parse incoming JSON payloads before routing the request.
app.use(express.json());

// Global request logger.
app.use(logger);

// Welcome route for the API base URL.
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Manager API is running',
    endpoints: {
      tasks: '/tasks',
      taskById: '/tasks/:id',
    },
  });
});

// Mount the task routes.
app.use('/tasks', tasksRouter);

// Custom 404 handler for unknown routes.
app.use((req, res) => {
  res.status(404).json({ error: 'Route Not Found' });
});

// Final global error handler.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
