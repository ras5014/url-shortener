import cron from "node-cron";
import logger from "../utils/logger";
import { redisClient } from "../config/redisClient";
import { UrlModel } from "../models/url";

// CRON jobs
export const schedule = () => {
  cron.schedule("* * * * * *", async () => {
    logger.info("MongoDB Batch Update Scheduler running...");
    try {
      // Batch Update MongoDB data here
      let cursor = "0";
      let keys: string[] = [];
      do {
        const [nextCursor, foundKeys] = await redisClient.scan(
          cursor,
          "MATCH",
          "pending_updates:*",
          "COUNT",
          "100"
        );
        cursor = nextCursor;
        keys = keys.concat(foundKeys);
      } while (cursor !== "0");
      console.log("Pending updates keys:", keys);

      if (keys.length === 0) {
        logger.info("No pending updates to process.");
        return;
      }

      const bulkOps = [];
      const keysToDelete = [];

      for (const key of keys) {
        // Get all pending updates for the key
        const pendingUpdates = await redisClient.smembers(key);
        const visitHistoryEntries = pendingUpdates.map((timestamp) => {
          return {
            timestamp: new Date(timestamp),
          };
        });
        if (pendingUpdates.length == 0) continue;
        logger.info("Visit History:", visitHistoryEntries);
        bulkOps.push({
          updateOne: {
            filter: { shortId: key.split(":")[1] },
            update: {
              $push: {
                visitHistory: {
                  $each: visitHistoryEntries,
                },
              },
            },
          },
        });
        keysToDelete.push(key);
      }

      // Execute the bulk update Operation once after accumulating all operations
      if (bulkOps.length > 0) {
        await UrlModel.bulkWrite(bulkOps);
      }

      // Clean up the Redis keys after processing
      if (keysToDelete.length > 0) {
        await redisClient.del(...keysToDelete);
      }
    } catch (error) {
      logger.error("Error in MongoDB Batch Update Scheduler:", error);
    }
  });
};
