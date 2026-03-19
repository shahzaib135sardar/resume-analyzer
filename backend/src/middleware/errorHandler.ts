import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(statusCode: number, message: string, code: string = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = err as AppError;

  const statusCode = error.statusCode || 500;
  const code = (error as AppError).code || 'INTERNAL_ERROR';
  const message = error.message || 'Internal server error';

  logger.error(`${code}: ${message}`);

  res.status(statusCode).json({
    error: {
      code,
      message
    }
  });
};
