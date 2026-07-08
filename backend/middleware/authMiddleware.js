const jwt = require('jsonwebtoken');

// Reads the token from the Authorization header ("Bearer <token>"),
// verifies it, and attaches the logged-in user's ID to req.user.
// Member 1 creates this token at login - I just need to verify it here
// so I know WHICH user's notes to create/fetch.
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // expects { id: userId }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
