const Queue = require("bull");
const redisConfig = { host: "localhost", port: 6379 };
const queue=new Queue("workflowQueue", { redis: redisConfig });
module.exports={queue};