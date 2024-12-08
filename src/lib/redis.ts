import { Redis } from "@upstash/redis";
import { configDotenv } from "dotenv";
configDotenv();
const redisClient = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_KEY,
});

export default redisClient;
