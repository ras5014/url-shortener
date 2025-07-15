import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/responses";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorResponse(res, "Not found", 404);
};
