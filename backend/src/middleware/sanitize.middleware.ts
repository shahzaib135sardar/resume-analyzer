import { Request, Response, NextFunction } from 'express';

const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    return value
      .trim()
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters including null byte
      .slice(0, 10000); // Truncate to 10k chars
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  return value;
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Skip for multipart/form-data (multer handles)
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    next();
    return;
  }

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  next();
};


