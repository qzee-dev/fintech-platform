const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { createLogger } = require('fintech-shared-libs');

const router = express.Router();
const logger = createLogger('Payment-Routes');

const NIBSS_API_URL = process.env.NIBSS_API_URL || 'http://localhost:3007';

// Initiate bank transfer
router.post('/bank-transfer', async (req, res) => {
  try {
    const {
      sourceAccountNumber,
      destinationAccountNumber,
      destinationBankCode,
      amount,
      description,
      idempotencyKey,
    } = req.body;

    if (!sourceAccountNumber || !destinationAccountNumber || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transferReference = `BT-${uuidv4().substring(0, 8)}`;

    try {
      // Call NIBSS mock API
      const response = await axios.post(`${NIBSS_API_URL}/api/transfer`, {
        sourceAccountNumber,
        destinationAccountNumber,
        destinationBankCode,
        amount,
        reference: transferReference,
        description,
      });

      logger.info(`Bank transfer initiated: ${transferReference}`);

      res.status(201).json({
        message: 'Bank transfer initiated',
        reference: transferReference,
        status: response.data.status || 'PENDING',
        amount,
      });
    } catch (nibssError) {
      logger.error('NIBSS API error:', nibssError.message);
      res.status(502).json({
        error: 'Failed to process bank transfer',
        message: nibssError.response?.data?.message || nibssError.message,
      });
    }
  } catch (error) {
    logger.error('Bank transfer error:', error);
    res.status(500).json({ error: 'Failed to initiate bank transfer' });
  }
});

// Get transfer status
router.get('/status/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    try {
      const response = await axios.get(
        `${NIBSS_API_URL}/api/transfer/${reference}`
      );

      res.json({
        reference,
        status: response.data.status,
        amount: response.data.amount,
        timestamp: response.data.timestamp,
      });
    } catch (nibssError) {
      logger.error('NIBSS API error:', nibssError.message);
      res.status(502).json({ error: 'Failed to fetch transfer status' });
    }
  } catch (error) {
    logger.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check transfer status' });
  }
});

// Validate account number
router.post('/validate-account', async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;

    if (!accountNumber || !bankCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const response = await axios.post(
        `${NIBSS_API_URL}/api/validate-account`,
        { accountNumber, bankCode }
      );

      res.json({
        valid: response.data.valid,
        accountName: response.data.accountName || null,
      });
    } catch (nibssError) {
      logger.error('NIBSS validation error:', nibssError.message);
      res.status(502).json({ error: 'Failed to validate account' });
    }
  } catch (error) {
    logger.error('Account validation error:', error);
    res.status(500).json({ error: 'Failed to validate account' });
  }
});

module.exports = router;
