const { createLogger } = require('fintech-shared-libs');

const logger = createLogger('Notification-Consumer');

const startNotificationConsumer = async (kafkaService) => {
  // Subscribe to transaction-completed topic
  await kafkaService.subscribeToTopic('transaction-completed', async (data) => {
    try {
      logger.info(`Sending notification for transaction: ${data.transactionId}`);
      // Notification logic will be triggered by events
    } catch (error) {
      logger.error('Notification consumer error:', error);
    }
  });
};

module.exports = { startNotificationConsumer };
