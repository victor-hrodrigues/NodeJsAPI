import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/api-erros";
import { logError } from "./logMiddleware";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Error";
  logError(error);
  return res.status(statusCode).json(message);
};
