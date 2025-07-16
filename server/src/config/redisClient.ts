import Redis from "ioredis";
import logger from "../utils/logger";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});
redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});
redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});
