require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createLogger, KafkaService, errorHandler } = require('fintech-shared-libs');
const { sequelize } = require('./models');
const fraudRoutes = require('./routes/fraud');
const { startFraudConsumer } = require('./consumers/fraudConsumer');

const app = express();
const logger = createLogger('Fraud-Service');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'fraud-service' });
});

app.use('/api/fraud', fraudRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3005;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    await sequelize.sync({ alter: false });

    const kafkaService = new KafkaService('fraud-service', 'fraud-service-group');
    await kafkaService.connect();
    logger.info('Kafka connected');

    await startFraudConsumer(kafkaService);

    app.listen(PORT, () => {
      logger.info(`Fraud Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
