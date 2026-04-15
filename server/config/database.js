import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sehatsetu';
  
  let retryCount = 0;
  const maxRetries = 5;
  const retryDelay = [1000, 2000, 4000, 8000, 16000];

  const connect = async () => {
    try {
      const conn = await mongoose.connect(MONGO_URI, {
        autoIndex: process.env.NODE_ENV !== 'production',
        heartbeatFrequencyMS: 10000,
      });
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      if (retryCount < maxRetries) {
        logger.warn(`MongoDB Connection Failed. retrying in ${retryDelay[retryCount]}ms... (${retryCount + 1}/${maxRetries})`);
        setTimeout(connect, retryDelay[retryCount]);
        retryCount++;
      } else {
        logger.error(`Error: ${error.message}`);
        logger.warn('Continuing without MongoDB. Some features will be unavailable.');
      }
    }
  };

  await connect();
};

export default connectDB;
