const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Basic email format check */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Shape of user data returned to the client (never expose password hash) */
const formatUser = (user, token) => ({
  _id:       user._id,
  name:      user.name,
  email:     user.email,
  createdAt: user.createdAt,
  token,
});

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @body    { name, email, password }
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!name || !email || !password) {
      return next(new AppError('Name, email and password are all required.', 400));
    }

    const trimmedName  = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return next(new AppError('Name must be at least 2 characters.', 400));
    }

    if (!isValidEmail(trimmedEmail)) {
      return next(new AppError('Please provide a valid email address.', 400));
    }

    if (password.length < 6) {
      return next(new AppError('Password must be at least 6 characters.', 400));
    }

    // ── Duplicate check ───────────────────────────────────────────────────────
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return next(new AppError('An account with that email already exists.', 409));
    }

    // ── Create user (password hashed via pre-save hook in User model) ─────────
    const user = await User.create({
      name:     trimmedName,
      email:    trimmedEmail,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json(formatUser(user, token));
  } catch (err) {
    // Mongoose duplicate key (race condition safety net)
    if (err.code === 11000) {
      return next(new AppError('An account with that email already exists.', 409));
    }
    next(err);
  }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 * @body    { email, password }
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!email || !password) {
      return next(new AppError('Email and password are required.', 400));
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return next(new AppError('Please provide a valid email address.', 400));
    }

    // ── Find user (re-include password for comparison) ────────────────────────
    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    // Use a single generic message to avoid leaking whether the email exists
    const invalidCredentialsError = new AppError(
      'Invalid email or password.',
      401
    );

    if (!user) {
      return next(invalidCredentialsError);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(invalidCredentialsError);
    }

    const token = generateToken(user._id);

    return res.status(200).json(formatUser(user, token));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get the currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private (requires Bearer token)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware (password already excluded)
    return res.status(200).json({
      _id:       req.user._id,
      name:      req.user.name,
      email:     req.user.email,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getMe };
