import { Request, Response } from "express";
import {
  generateShortUrl,
  getShortUrl,
  getAnalytics,
} from "../services/url.service";
import { successResponse, errorResponse } from "../utils/responses";

export const generateShortUrlController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = req.body;
    const newUrl = await generateShortUrl(data);
    successResponse(res, "Short URL generated successfully", newUrl, 201);
  } catch (error) {
    errorResponse(res, "Failed to generate short URL", 500);
  }
};

export const getShortUrlController = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;
    const redirectUrl = await getShortUrl({ shortId });
    res.redirect(redirectUrl);
  } catch (error) {
    errorResponse(res, "Failed to retrieve short URL", 404);
  }
};

export const getAnalyticsController = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;
    const analytics = await getAnalytics({ shortId });
    successResponse(res, "Analytics retrieved successfully", analytics, 200);
  } catch (error) {
    errorResponse(res, "Failed to retrieve analytics", 404);
  }
};
