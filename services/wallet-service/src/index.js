require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createLogger, KafkaService, errorHandler } = require('fintech-shared-libs');
const { sequelize } = require('./models');
const walletRoutes = require('./routes/wallet');

const app = express();
const logger = createLogger('Wallet-Service');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wallet-service' });
});

app.use('/api/wallet', walletRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    await sequelize.sync({ alter: false });

    // Initialize Kafka
    const kafkaService = new KafkaService('wallet-service');
    await kafkaService.connect();
    logger.info('Kafka connected');

    app.listen(PORT, () => {
      logger.info(`Wallet Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
