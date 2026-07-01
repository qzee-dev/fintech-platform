const { Sequelize } = require('sequelize');
const UserModel = require('./User');

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://fintech_user:fintech_secure_password@localhost:5432/fintech_db',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

const User = UserModel(sequelize);

module.exports = {
  sequelize,
  User,
};
