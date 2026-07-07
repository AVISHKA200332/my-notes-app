const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: generate a signed JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  // TODO: Implement registration logic
  res.status(501).json({ message: 'Register – not yet implemented' });
};

// @desc    Authenticate user and return token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  // TODO: Implement login logic
  res.status(501).json({ message: 'Login – not yet implemented' });
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json({ user: req.user });
};

module.exports = { registerUser, loginUser, getMe };
