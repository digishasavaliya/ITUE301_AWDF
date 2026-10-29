require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const aiRouter = require('./routes/ai');
const cache = require('./config/cache');
require('./listeners');

const app = express();
const PORT = process.env.PORT || 5000;

// Parse incoming JSON payloads before routing the request.
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

// Global request logger.
app.use(logger);

// Welcome route for the API base URL.
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Manager API is running',
    endpoints: {
      tasks: '/tasks',
      taskById: '/tasks/:id',
      register: '/register',
      login: '/login',
      me: '/me',
      debugCache: '/debug/cache (development-only cache diagnostics)',
    },
  });
});

app.get('/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ok' : 'degraded',
    database: databaseReady ? 'connected' : 'disconnected',
  });
});

app.get('/debug/cache', auth, (req, res) => {
  const stats = cache.getStats();

  res.status(200).json({
    message: 'Development-only cache statistics. Do not use in production.',
    hits: stats.hits,
    misses: stats.misses,
    keys: stats.keys,
    allTasksCached: stats.allTasksCached,
    taskCacheKeys: stats.taskCacheKeys,
  });
});

// Mount the task routes.
app.use('/', authRouter);
app.use('/tasks', tasksRouter);
app.use('/api/ai', aiRouter);

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
