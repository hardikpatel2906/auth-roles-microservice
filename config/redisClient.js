const redis = require('redis');

const redisClient = redis.createClient({
  legacyMode: true // for compatibility with callback-style API
});

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
