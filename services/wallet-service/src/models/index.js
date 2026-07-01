const { Sequelize } = require('sequelize');
const WalletModel = require('./Wallet');

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://fintech_user:fintech_secure_password@localhost:5432/fintech_db',
  {
    dialect: 'postgres',
    logging: false,
  }
);

const Wallet = WalletModel(sequelize);

module.exports = {
  sequelize,
  Wallet,
};
