import { Request, Response } from "express";
import { Router } from "express";
import {
  generateShortUrlController,
  getShortUrlController,
} from "../controllers/url.controller";

const router = Router();

router.post("/generate", generateShortUrlController);
router.get("/:shortId", getShortUrlController);

export default router;
