/**
 * Custom operational error class.
 * Carry an HTTP status code so the global error handler can forward it directly.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from programming/unexpected errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
