const jwt = require('jsonwebtoken');
const { createLogger } = require('../utils/logger');

const logger = createLogger('Auth-Middleware');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authMiddleware };
