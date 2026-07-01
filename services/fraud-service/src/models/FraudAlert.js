const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const FraudAlert = sequelize.define(
    'FraudAlert',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      ruleId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      riskScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      alertType: {
        type: DataTypes.ENUM('HIGH_AMOUNT', 'UNUSUAL_TIME', 'MULTIPLE_FAILURES'),
        allowNull: false,
      },
      details: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'REVIEWED', 'RESOLVED'),
        defaultValue: 'PENDING',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      schema: 'fraud',
      timestamps: true,
      tableName: 'fraud_alerts',
    }
  );

  return FraudAlert;
};
