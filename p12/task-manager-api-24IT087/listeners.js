const taskEvents = require('./events');

function getAssignedUser(task, assignedUser) {
  return task.assignedUser || task.assignedTo || assignedUser || 'not assigned';
}

// Register the reserved error listener before any custom listener can emit it.
taskEvents.on('error', (error) => {
  console.error(`[${new Date().toISOString()}] Task event error:`, error.message);
});

taskEvents.on('task-notification-error', (error) => {
  console.error(`[${new Date().toISOString()}] Notification failed:`, error.message);
});

taskEvents.on('task-created', ({ task, assignedUser }) => {
  const createdAt = new Date().toISOString();

  setTimeout(() => {
    try {
      const completedAt = new Date().toISOString();
      console.log(
        `[${completedAt}] Task notification completed: title="${task.title}", ` +
        `taskTimestamp=${task.createdAt?.toISOString?.() || task.createdAt}, ` +
        `assignedUser=${getAssignedUser(task, assignedUser)}`,
      );
    } catch (error) {
      taskEvents.emit('task-notification-error', error);
    }
  }, 2000);

  console.log(`[${createdAt}] Task notification scheduled: title="${task.title}" (2s delay)`);
});

taskEvents.on('task-deleted', ({ task, deletedAt, assignedUser }) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Task deletion notification: title="${task.title}", ` +
      `taskTimestamp=${task.createdAt?.toISOString?.() || task.createdAt}, ` +
      `deletedAt=${deletedAt}, assignedUser=${getAssignedUser(task, assignedUser)}`,
    );
  } catch (error) {
    taskEvents.emit('task-notification-error', error);
  }
});

module.exports = taskEvents;
