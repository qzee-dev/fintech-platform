const { Transaction } = require('../models');
const { createLogger } = require('../utils/logger');
const axios = require('axios');

const logger = createLogger('Transaction-Consumer');

const startTransactionConsumer = async (kafkaService) => {
  await kafkaService.subscribeToTopic('transactions', async (data) => {
    try {
      logger.info(`Processing transaction: ${data.transactionId}`);

      const transaction = await Transaction.findByPk(data.transactionId);
      if (!transaction) {
        logger.warn(`Transaction not found: ${data.transactionId}`);
        return;
      }

      // Update transaction to PROCESSING
      await transaction.update({ status: 'PROCESSING' });

      // Call ledger service to record entries
      try {
        await axios.post('http://localhost:3005/api/ledger/record', {
          transactionId: transaction.id,
          sourceWalletId: transaction.sourceWalletId,
          destinationWalletId: transaction.destinationWalletId,
          amount: transaction.amount,
          type: transaction.type,
        });
      } catch (error) {
        logger.error('Ledger service error:', error.message);
        await transaction.update({
          status: 'FAILED',
          failedReason: 'Ledger recording failed',
        });
        return;
      }

      // Update transaction to COMPLETED
      await transaction.update({
        status: 'COMPLETED',
        settledAt: new Date(),
      });

      // Publish completion event
      await kafkaService.publishEvent('transaction-completed', {
        transactionId: transaction.id,
        status: 'COMPLETED',
      });

      logger.info(`Transaction completed: ${transaction.id}`);
    } catch (error) {
      logger.error('Transaction processing error:', error);
    }
  });
};

module.exports = { startTransactionConsumer };
