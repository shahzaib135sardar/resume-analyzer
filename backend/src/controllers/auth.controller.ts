import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import env from '../config/env';
import { AuthUser, JwtPayload, RefreshTokenPayload } from '../types';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const users: AuthUser[] = [];
const refreshTokens = new Map<string, string>(); // tokenFamily -> userId

const signAccessToken = (user: AuthUser): string => {
  return jwt.sign(
    { userId: user.id, email: user.email } as JwtPayload,
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const signRefreshToken = (user: AuthUser, tokenFamily: string): string => {
  return jwt.sign(
    { userId: user.id, email: user.email, tokenFamily } as RefreshTokenPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.validatedBody;

  if (users.find(u => u.email === email)) {
    throw new AppError(409, 'Email already exists', 'EMAIL_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user: AuthUser = {
    id: uuidv4(),
    email,
    name,
    passwordHash: hashedPassword,
    createdAt: new Date()
  };

  users.push(user);

  const tokenFamily = uuidv4();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, tokenFamily);
  refreshTokens.set(tokenFamily, user.id);

  logger.info(`User registered: ${email} (${user.id})`, { tokenFamily });

  res.status(201).json({ 
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name }
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.validatedBody;
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const tokenFamily = uuidv4();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, tokenFamily);
  refreshTokens.set(tokenFamily, user.id);

  logger.info(`User logged in: ${email} (${user.id})`, { tokenFamily });

  res.json({ 
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name }
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    refreshToken = req.body.refreshToken;
  }

  if (!refreshToken) {
    throw new AppError(401, 'Refresh token required', 'NO_REFRESH_TOKEN');
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    const storedUserId = refreshTokens.get(decoded.tokenFamily);

    if (!storedUserId || storedUserId !== decoded.userId) {
      throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Rotate token family
    refreshTokens.delete(decoded.tokenFamily);
    const newTokenFamily = uuidv4();
    refreshTokens.set(newTokenFamily, decoded.userId);

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      throw new AppError(401, 'User not found', 'USER_NOT_FOUND');
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user, newTokenFamily);

    logger.info(`Tokens refreshed for user ${decoded.userId} (${decoded.email})`, { oldFamily: decoded.tokenFamily, newFamily: newTokenFamily });

    res.json({ 
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
  } catch (error) {
    logger.warn(`Refresh token verification failed: ${(error as Error).message}`);
    throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
  }
};

export const logout = async (req: Request, res: Response) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    refreshToken = req.body.refreshToken;
  }

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
      refreshTokens.delete(decoded.tokenFamily);
      logger.info(`User logged out: invalidated token family ${decoded.tokenFamily}`);
    } catch (error) {
      // Token already invalid
    }
  }

  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated', 'NOT_AUTHENTICATED');
  }
  res.json({ 
    id: req.user.id,
    email: req.user.email,
    name: req.user.name 
  });
};

