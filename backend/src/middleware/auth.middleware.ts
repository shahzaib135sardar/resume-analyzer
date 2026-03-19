import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthUser } from '../types';
import { AppError } from './errorHandler';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';



export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new AppError(401, 'No token provided', 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = { id: decoded.userId, email: decoded.email } as AuthUser;
    next();
  } catch (error) {
    logger.warn(`Auth failed: ${(error as Error).message}`);
    throw new AppError(401, 'Invalid token', 'UNAUTHORIZED');
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      (req as any).user = { id: decoded.userId, email: decoded.email } as AuthUser;
    }
    next();
  } catch (error) {
    logger.warn(`Optional auth failed: ${(error as Error).message}`);
    next();
  }
};
