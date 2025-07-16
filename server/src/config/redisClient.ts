import Redis from "ioredis";
import logger from "../utils/logger";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
});
redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});
redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});
