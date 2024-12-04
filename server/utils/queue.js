const Queue = require("bull");
const redisConfig = { host: "localhost", port: 6379 };
function newQueue(queueName) {
  const queue = new Queue(queueName, { redis: redisConfig });
  return queue;}
module.exports = { newQueue };