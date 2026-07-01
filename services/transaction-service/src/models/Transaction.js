const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      sourceWalletId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      destinationWalletId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      destinationAccountNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      destinationBankCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'NGN',
      },
      type: {
        type: DataTypes.ENUM(
          'TRANSFER',
          'DEPOSIT',
          'WITHDRAWAL',
          'PAYMENT'
        ),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'PROCESSING',
          'COMPLETED',
          'FAILED',
          'REVERSED'
        ),
        defaultValue: 'PENDING',
      },
      reference: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      idempotencyKey: {
        type: DataTypes.STRING(255),
        unique: true,
      },
      description: DataTypes.TEXT,
      metadata: DataTypes.JSONB,
      initiatedByUserId: DataTypes.UUID,
      failedReason: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      settledAt: DataTypes.DATE,
    },
    {
      schema: 'transactions',
      timestamps: true,
      tableName: 'transactions',
    }
  );

  return Transaction;
};
