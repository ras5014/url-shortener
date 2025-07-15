import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/responses";

export const notFoundHandler = (res: Response) => {
  errorResponse(res, "Not found", 404);
};
