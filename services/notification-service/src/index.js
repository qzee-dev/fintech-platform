require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createLogger, KafkaService, errorHandler } = require('fintech-shared-libs');
const notificationRoutes = require('./routes/notification');
const { startNotificationConsumer } = require('./consumers/notificationConsumer');

const app = express();
const logger = createLogger('Notification-Service');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

app.use('/api/notification', notificationRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3006;

const startServer = async () => {
  try {
    const kafkaService = new KafkaService('notification-service', 'notification-service-group');
    await kafkaService.connect();
    logger.info('Kafka connected');

    await startNotificationConsumer(kafkaService);

    app.listen(PORT, () => {
      logger.info(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
