import { logger } from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Create correlation ID if not present
  const correlationId = res.locals.correlationId || 'N/A';

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - CorrelationID: ${correlationId}`);
  if (err.stack) {
    logger.debug(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code: statusCode,
    correlationId,
    details: process.env.NODE_ENV === 'development' ? err.details || null : null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
