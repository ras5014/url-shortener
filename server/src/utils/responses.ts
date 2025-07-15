import { Response } from "express";

export const successResponse = (
  res: Response,
  message: string = "Request was successful",
  data: any,
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string = "An error occurred",
  statusCode: number = 500
) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};
