// src/config/index.js
// Load environment variables and expose a config object.
// This file is required early by the application so that process.env
// contains the values defined in .env.

const path = require('path');
const dotenv = require('dotenv');

// Resolve .env file relative to the project root.
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

// Export only the variables we explicitly need. Add more as the project grows.
module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // CORS settings – the allowed origin will be set in .env
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  // JWT secret placeholder (will be used later)
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
};
