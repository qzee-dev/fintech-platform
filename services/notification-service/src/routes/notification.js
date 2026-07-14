const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { createLogger } = require('fintech-shared-libs');

const router = express.Router();
const logger = createLogger('Notification-Routes');

// Setup email transporter
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'noreply@fintech.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

// Setup Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send email
router.post('/email', async (req, res) => {
  try {
    const { to, subject, template, data } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailContent = generateEmailContent(template, data);

    await emailTransporter.sendMail({
      from: 'noreply@fintech.com',
      to,
      subject,
      html: emailContent,
    });

    logger.info(`Email sent to ${to}`);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    logger.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Send SMS
router.post('/sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });

    logger.info(`SMS sent to ${to}`);

    res.json({ message: 'SMS sent successfully' });
  } catch (error) {
    logger.error('SMS sending error:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

const generateEmailContent = (template, data) => {
  const templates = {
    transaction_completed: `
      <h2>Transaction Completed</h2>
      <p>Your transaction of ${data.amount} ${data.currency} has been completed successfully.</p>
      <p><strong>Reference:</strong> ${data.reference}</p>
      <p><strong>Date:</strong> ${data.date}</p>
    `,
    payment_received: `
      <h2>Payment Received</h2>
      <p>You have received ${data.amount} ${data.currency} from ${data.senderName}.</p>
      <p><strong>Reference:</strong> ${data.reference}</p>
    `,
    fraud_alert: `
      <h2>Security Alert</h2>
      <p>An unusual transaction was detected on your account.</p>
      <p><strong>Risk Score:</strong> ${data.riskScore}%</p>
      <p>If this wasn't you, please contact support immediately.</p>
    `,
  };

  return templates[template] || '<p>Notification</p>';
};

module.exports = router;
