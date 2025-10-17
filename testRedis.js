// testRedis.js
const redisClient = require('./config/redisClient');

(async () => {
  try {
    await redisClient.set('myKey', 'Hello Redis!');
    const value = await redisClient.get('myKey');
    console.log('Value from Redis:', value); // Should print: Hello Redis!
  } catch (err) {
    console.error('Redis error:', err);
  } finally {
    process.exit(0);
  }
})();
