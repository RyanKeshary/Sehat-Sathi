import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../middleware/errorMiddleware.js';

/**
 * Generate Access and Refresh Tokens
 */
export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * Handle OTP Generation (Mocked for now)
 */
export const generateOTP = async (phone) => {
  // In a real app, integrate with Twilio/Msg91 here
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in cache/DB with TTL (simplified for demo)
  // For now, we'll just log it
  console.log(`[AUTH SERVICE] OTP for ${phone}: ${otp}`);
  
  return otp;
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.tokenVersion !== decoded.tokenVersion || !user.isActive) {
      throw new AppError('Invalid refresh token or user inactive', 401);
    }

    const tokens = generateTokens(user);
    return tokens;
  } catch (error) {
    throw new AppError('Authentication failed', 401);
  }
};
