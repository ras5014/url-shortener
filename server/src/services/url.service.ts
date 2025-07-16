import { UrlModel } from "../models/url";
import { nanoid } from "nanoid";
import logger from "../utils/logger";
import { redisClient } from "../config/redisClient";

export const generateShortUrl = async (data: { url: string }) => {
  if (!data.url) {
    logger.error("URL is required to generate a short URL");
    throw new Error("URL is required");
  }
  const shortID = nanoid(8);

  const newUrl = await UrlModel.create({
    shortId: shortID,
    redirectUrl: data.url,
    visitHistory: [],
  });

  // Cache the new URL in Redis
  await redisClient.set(shortID, JSON.stringify(newUrl), "EX", 60 * 60 * 24); // Cache for 24 hours
  return newUrl;
};

export const getShortUrl = async (data: { shortId: string }) => {
  // Check if the URL is cached in Redis
  const cachedUrl = await redisClient.get(data.shortId);
  // If the URL is cached, return it
  // If not, fetch from MongoDB and cache it
  if (cachedUrl) {
    logger.info(`Retrieved URL from cache for shortId: ${data.shortId}`);
    const parsedUrl = JSON.parse(cachedUrl);
    const timestamp = new Date();
    parsedUrl.visitHistory.push({ timestamp });
    // Update the cached URL in Redis
    await redisClient.set(
      data.shortId,
      JSON.stringify(parsedUrl),
      "EX",
      60 * 60 * 24
    ); // Cache for 24 hours

    // Update the URL visit history in the mongo database process
    // Store pending update in Redis Set (more efficient than array)
    await redisClient.sadd(
      `pending_updates:${data.shortId}`,
      timestamp.toISOString()
    );
    await redisClient.expire(`pending_updates:${data.shortId}`, 60 * 60); // Cache for 1 hours

    return parsedUrl.redirectUrl;
  }
  const url = await UrlModel.findOneAndUpdate(
    { shortId: data.shortId },
    {
      $push: {
        visitHistory: { timestamp: new Date() },
      },
    },
    { new: true, upsert: false }
  );
  if (!url) {
    logger.error(`Short URL with ID ${data.shortId} not found`);
    throw new Error("Short URL not found");
  }
  logger.info(
    `Visit recorded for shortId: ${data.shortId}, total visits: ${
      url.visitHistory?.length || 0
    }`
  );
  // Cache the updated URL in Redis
  await redisClient.set(data.shortId, JSON.stringify(url), "EX", 60 * 60 * 24); // Cache for 24 hours
  return url.redirectUrl;
};

export const getAnalytics = async (data: { shortId: string }) => {
  const url = await UrlModel.findOne({ shortId: data.shortId });
  if (!url) {
    logger.error(`Short URL with ID ${data.shortId} not found for analytics`);
    throw new Error("Short URL not found");
  }
  return {
    shortId: url.shortId,
    totalVisits: url.visitHistory?.length || 0,
  };
};
