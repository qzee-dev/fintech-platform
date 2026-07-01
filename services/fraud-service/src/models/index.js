const { Sequelize } = require('sequelize');
const FraudAlertModel = require('./FraudAlert');

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://fintech_user:fintech_secure_password@localhost:5432/fintech_db',
  {
    dialect: 'postgres',
    logging: false,
  }
);

const FraudAlert = FraudAlertModel(sequelize);

module.exports = {
  sequelize,
  FraudAlert,
};
