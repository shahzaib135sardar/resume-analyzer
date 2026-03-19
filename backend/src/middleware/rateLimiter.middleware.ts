import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    res.set('Retry-After', Math.ceil((15 * 60 * 1000 - Date.now() % (15 * 60 * 1000)) / 1000).toString());
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.'
      }
    });
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    res.set('Retry-After', '900');
    res.status(429).json({
      error: {
        code: 'LOGIN_RATE_LIMIT',
        message: 'Too many login attempts. Try again in 15 minutes.'
      }
    });
  }
});

export const analysisLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    res.set('Retry-After', '86400');
    res.status(429).json({
      error: {
        code: 'ANALYSIS_RATE_LIMIT',
        message: 'Daily analysis limit reached. Try again tomorrow.'
      }
    });
  }
});

export const statusLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.set('Retry-After', '60');
    res.status(429).json({
      error: {
        code: 'STATUS_RATE_LIMIT',
        message: 'Too many status checks. Please wait.'
      }
    });
  }
});

