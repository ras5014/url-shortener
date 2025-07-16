import { Request, Response } from "express";
import { Router } from "express";
import {
  generateShortUrlController,
  getShortUrlController,
  getAnalyticsController,
} from "../controllers/url.controller";

const router = Router();

router.post("/generate", generateShortUrlController);
router.get("/:shortId", getShortUrlController);
router.get("/analytics/:shortId", getAnalyticsController);

export default router;
