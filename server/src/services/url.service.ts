import { UrlModel } from "../models/url";
import { nanoid } from "nanoid";
import logger from "../utils/logger";

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
  return newUrl;
};

export const getShortUrl = async (data: { shortId: string }) => {
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
  return url.redirectUrl;
};
