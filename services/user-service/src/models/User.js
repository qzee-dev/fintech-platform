const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true,
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      bvn: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true,
      },
      profilePictureUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      accountStatus: {
        type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'CLOSED'),
        defaultValue: 'ACTIVE',
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      kycStatus: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
      },
      kycVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
      schema: 'users',
      timestamps: true,
      tableName: 'users',
    }
  );

  // Hash password before saving
  User.beforeCreate(async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
  });

  // Method to compare passwords
  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};
