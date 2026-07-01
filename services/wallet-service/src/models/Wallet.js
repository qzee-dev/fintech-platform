const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Wallet = sequelize.define(
    'Wallet',
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
      accountNumber: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
      },
      accountType: {
        type: DataTypes.ENUM('SAVINGS', 'CHECKING'),
        defaultValue: 'SAVINGS',
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'NGN',
      },
      balance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0.0,
      },
      availableBalance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0.0,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isFrozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      schema: 'wallets',
      timestamps: true,
      tableName: 'wallets',
    }
  );

  return Wallet;
};
