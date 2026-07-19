const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createLogger } = require('../utils/logger');

const router = express.Router();
const logger = createLogger('Transfer-Routes');

// In-memory store for transfer status
const transfers = {};

// Initiate transfer
router.post('/', async (req, res) => {
  try {
    const {
      sourceAccountNumber,
      destinationAccountNumber,
      destinationBankCode,
      amount,
      reference,
      description,
    } = req.body;

    if (
      !sourceAccountNumber ||
      !destinationAccountNumber ||
      !destinationBankCode ||
      !amount ||
      !reference
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    const transfer = {
      id: uuidv4(),
      reference,
      sourceAccountNumber,
      destinationAccountNumber,
      destinationBankCode,
      amount,
      description,
      status: isSuccess ? 'COMPLETED' : 'FAILED',
      timestamp: new Date(),
      failureReason: isSuccess ? null : 'Account not found',
    };

    transfers[reference] = transfer;

    logger.info(`Transfer ${reference}: ${transfer.status}`);

    res.status(isSuccess ? 200 : 400).json({
      status: transfer.status,
      reference,
      transactionId: transfer.id,
      message: isSuccess
        ? 'Transfer processed successfully'
        : transfer.failureReason,
      timestamp: transfer.timestamp,
    });
  } catch (error) {
    logger.error('Transfer processing error:', error);
    res.status(500).json({ error: 'Transfer processing failed' });
  }
});

// Get transfer status
router.get('/:reference', (req, res) => {
  try {
    const transfer = transfers[req.params.reference];

    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    res.json({
      reference: transfer.reference,
      status: transfer.status,
      amount: transfer.amount,
      timestamp: transfer.timestamp,
      failureReason: transfer.failureReason,
    });
  } catch (error) {
    logger.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to fetch transfer status' });
  }
});

module.exports = router;
