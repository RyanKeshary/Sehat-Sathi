import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { generateTokens, generateOTP } from '../services/authService.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { formatResponse } from '../utils/responseFormatter.js';

export const register = async (req, res, next) => {
  try {
    const { name, phone, password, role, ...profileData } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return next(new AppError('User with this phone number already exists', 400));
    }

    const user = await User.create({
      name,
      phone,
      password,
      role,
    });

    // Create profile based on role
    if (role === 'patient') {
      await Patient.create({ user: user._id, ...profileData });
    } else if (role === 'doctor') {
      await Doctor.create({ user: user._id, ...profileData });
    }

    const tokens = generateTokens(user);

    formatResponse(res, 201, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return next(new AppError('Please provide phone and password', 400));
    }

    const user = await User.findOne({ phone }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect phone or password', 401));
    }

    const tokens = generateTokens(user);

    formatResponse(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Increment token version to invalidate all current tokens
    req.user.tokenVersion += 1;
    await req.user.save();

    formatResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    await generateOTP(phone);
    formatResponse(res, 200, 'OTP sent successfully (Check console in development)');
  } catch (error) {
    next(error);
  }
};
