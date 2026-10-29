const { EventEmitter } = require('events');

// A shared, process-local event bus for task lifecycle events.
const taskEvents = new EventEmitter();

module.exports = taskEvents;
