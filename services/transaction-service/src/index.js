require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createLogger } = require('./utils/logger');
const { sequelize } = require('./models');
const transactionRoutes = require('./routes/transaction');
const { errorHandler } = require('./middleware/errorHandler');
const { KafkaService } = require('./services/kafka');
const { startTransactionConsumer } = require('./consumers/transactionConsumer');

const app = express();
const logger = createLogger('Transaction-Service');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'transaction-service' });
});

app.use('/api/transaction', transactionRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    await sequelize.sync({ alter: false });

    const kafkaService = new KafkaService();
    await kafkaService.connect();
    logger.info('Kafka connected');

    // Start consumer
    await startTransactionConsumer(kafkaService);

    app.listen(PORT, () => {
      logger.info(`Transaction Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
