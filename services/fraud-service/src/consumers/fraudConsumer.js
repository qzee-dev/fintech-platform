const { createLogger } = require('fintech-shared-libs');

const logger = createLogger('Fraud-Consumer');

const startFraudConsumer = async (kafkaService) => {
  await kafkaService.subscribeToTopic('transactions', async (data) => {
    try {
      logger.info(`Checking transaction for fraud: ${data.transactionId}`);
      // Fraud check logic will be handled by API calls
    } catch (error) {
      logger.error('Fraud consumer error:', error);
    }
  });
};

module.exports = { startFraudConsumer };
