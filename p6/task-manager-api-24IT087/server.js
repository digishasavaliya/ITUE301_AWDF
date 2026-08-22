require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middleware/logger');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Parse incoming JSON payloads before routing the request.
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));

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
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Something went wrong',
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);

    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  });

module.exports = app;
