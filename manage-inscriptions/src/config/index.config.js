const path = require('path');

// Server configuration
const PORT = process.env.PORT || 3000;
const IP_ADDRESS = process.env.IP_ADDRESS || '0.0.0.0';

// MongoDB configuration
const MONGO_URI = process.env.MONGO_URI ||
  `mongodb://${process.env.MONGO_USER || 'admin'}:${process.env.MONGO_PASSWORD || 'secret'}@${process.env.MONGO_HOST || 'mongo'}:${process.env.MONGO_PORT || '27017'}/${process.env.MONGO_DB || 'uptc_fit'}?authSource=admin`;

// File upload API
const API_CONSENTS = process.env.API_CONSENTS || 'http://localhost:3001/api/consents';
const endpointsConsents = {
  upload: `${API_CONSENTS}/upload-consent`,
  getFile: `${API_CONSENTS}/consent`,
};

// CORS configuration
const allowedOrigins = [
  process.env.DEV_URL || 'http://localhost:5173',
  process.env.PROD_URL || 'http://manage-inscriptions-uptc-fit-frontend-1'
];

module.exports = {
  PORT,
  IP_ADDRESS,
  MONGO_URI,
  endpointsConsents,
  allowedOrigins,
};