const { Sequelize } = require('sequelize');
const TransactionModel = require('./Transaction');

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://fintech_user:fintech_secure_password@localhost:5432/fintech_db',
  {
    dialect: 'postgres',
    logging: false,
  }
);

const Transaction = TransactionModel(sequelize);

module.exports = {
  sequelize,
  Transaction,
};
