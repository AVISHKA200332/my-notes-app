const AppError = require('../utils/AppError');

/**
 * Generic field-presence validator.
 * Pass an array of required field names; returns a 400 if any are missing/empty.
 *
 * Usage:
 *   router.post('/register', validateRequest(['name','email','password']), registerUser)
 */
const validateRequest = (fields) => (req, res, next) => {
  const missing = fields.filter(
    (f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === ''
  );

  if (missing.length > 0) {
    return next(
      new AppError(`Missing required fields: ${missing.join(', ')}`, 400)
    );
  }
  next();
};

module.exports = validateRequest;
