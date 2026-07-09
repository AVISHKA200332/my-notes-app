const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect }     = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// @route  POST /api/auth/register
router.post(
  '/register',
  validateRequest(['name', 'email', 'password']),
  registerUser
);

// @route  POST /api/auth/login
router.post(
  '/login',
  validateRequest(['email', 'password']),
  loginUser
);

// @route  GET /api/auth/me   (protected)
router.get('/me', protect, getMe);

module.exports = router;
