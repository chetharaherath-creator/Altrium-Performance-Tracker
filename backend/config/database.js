const { Sequelize } = require('sequelize');
require('dotenv').config();

// We initialize Sequelize with environment variables.
// Users will need to set these in their .env file.
const sequelize = new Sequelize(
  process.env.DB_NAME || 'amtrium_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

module.exports = sequelize;
