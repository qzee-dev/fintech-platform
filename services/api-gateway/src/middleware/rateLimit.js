const { createLogger } = require('../utils/logger');

const logger = createLogger('Rate-Limit-Middleware');

const requestCounts = {};
const RATE_LIMIT = 100; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 0, resetTime: now + WINDOW_MS };
  }

  if (now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 0, resetTime: now + WINDOW_MS };
  }

  requestCounts[ip].count++;

  if (requestCounts[ip].count > RATE_LIMIT) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
};

module.exports = { rateLimitMiddleware };
