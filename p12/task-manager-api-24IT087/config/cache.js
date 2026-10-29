const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
});

cache.hits = 0;
cache.misses = 0;

cache.incrementHit = function incrementHit() {
  cache.hits += 1;
};

cache.incrementMiss = function incrementMiss() {
  cache.misses += 1;
};

cache.safeGet = function safeGet(key) {
  try {
    return cache.get(key);
  } catch (error) {
    console.warn('Cache read failed:', error.message);
    return undefined;
  }
};

cache.safeSet = function safeSet(key, value) {
  try {
    cache.set(key, value);
    return true;
  } catch (error) {
    console.warn('Cache write failed:', error.message);
    return false;
  }
};

cache.safeDel = function safeDel(key) {
  try {
    cache.del(key);
    return true;
  } catch (error) {
    console.warn('Cache deletion failed:', error.message);
    return false;
  }
};

cache.getStats = function getStats() {
  const keys = cache.keys();

  return {
    hits: cache.hits,
    misses: cache.misses,
    keys,
    allTasksCached: keys.includes('all_tasks'),
    taskCacheKeys: keys.filter((key) => key.startsWith('task_')),
  };
};

module.exports = cache;
