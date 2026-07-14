const express = require('express');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');
const { createLogger } = require('fintech-shared-libs');

const router = express.Router();
const logger = createLogger('Profile-Routes');

// Get profile
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      profilePictureUrl: user.profilePictureUrl,
      kycStatus: user.kycStatus,
      accountStatus: user.accountStatus,
    });
  } catch (error) {
    logger.error('Profile retrieval error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/:userId', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, profilePictureUrl } = req.body;

    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      profilePictureUrl: profilePictureUrl || user.profilePictureUrl,
    });

    logger.info(`User profile updated: ${user.id}`);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
