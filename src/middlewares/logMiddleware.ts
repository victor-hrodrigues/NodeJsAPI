import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/api-erros";
import { getDatetime } from "../helpers/dateTime";
import { saveToLogFile } from "../helpers/saveToLogFile";

const dateTime = getDatetime();

export const logMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logInfo(req.path);
  next();
};

export const logInfo = (message: string) => {
  const logMessage = `\r${dateTime} API-TEMPLATE INFO: ${message}`;
  console.error(logMessage);
  saveToLogFile(logMessage);
};

export const logError = (error: Error) => {
  const logMessage = `\r${dateTime} API-TEMPLATE ERROR: ${error.message}`;
  console.error(logMessage);
  saveToLogFile(logMessage);
};

export const logApiError = (error: ApiError) => {
  const logMessage = `\r${dateTime} API-TEMPLATE API-ERROR: ${error.message}\r\nMESSAGE: ${error.message}\r\nSTATUS CODE: ${error.statusCode} `;
  console.error(logMessage);
  saveToLogFile(logMessage);
};

export const logExternalError = (error: Error) => {
  const logMessage = `\r${dateTime} API-TEMPLATE EXTERNAL-ERROR: ${error.message}`;
  console.error(logMessage);
  saveToLogFile(logMessage);
};
