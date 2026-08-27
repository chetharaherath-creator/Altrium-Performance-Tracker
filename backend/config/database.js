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
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

module.exports = sequelize;
