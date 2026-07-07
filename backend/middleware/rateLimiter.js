const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for auth endpoints — prevents brute-force attacks.
 * 10 requests per IP per 15 minutes on /api/auth/*
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

module.exports = { authLimiter };
