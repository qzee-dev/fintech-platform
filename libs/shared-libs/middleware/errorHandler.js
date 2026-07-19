const { createLogger } = require('../utils/logger');

const logger = createLogger('Error-Handler');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

module.exports = { errorHandler };
