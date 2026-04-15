export const formatResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const formatErrorResponse = (res, statusCode, message, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    code: statusCode,
    details,
  });
};
