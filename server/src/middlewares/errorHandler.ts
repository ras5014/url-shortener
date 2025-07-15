import { errorResponse } from "../utils/responses";
import { NextFunction, Request, Response } from "express";

type ErrorWithStatus = Error & { status?: number };

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  errorResponse(res, message, statusCode);

  next();
};
