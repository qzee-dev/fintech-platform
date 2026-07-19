require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createLogger, KafkaService, errorHandler } = require('fintech-shared-libs');
const { sequelize } = require('./models');
const paymentRoutes = require('./routes/payment');

const app = express();
const logger = createLogger('Payment-Service');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

app.use('/api/payment', paymentRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  // Start the API immediately
  app.listen(PORT, () => {
    logger.info(`Payment Service running on port ${PORT}`);
  });

  // Initialize PostgreSQL
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync({ alter: false });
  } catch (error) {
    logger.error('Database unavailable:', error.message);
  }

  // Initialize Kafka
  try {
    const kafkaService = new KafkaService('payment-service');
    await kafkaService.connect();
    logger.info('Kafka connected');
  } catch (error) {
    logger.error('Kafka unavailable:', error.message);
  }
};

startServer();

module.exports = app;