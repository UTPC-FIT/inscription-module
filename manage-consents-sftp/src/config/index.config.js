const multer = require('multer');
const sftpConfig = require('./sftp.config.js');

// Multer configuration
const upload = multer({ dest: 'tmp/' });

// Server configuration
const PORT = process.env.PORT || 3000;
const IP_ADDRESS = process.env.IP_ADDRESS || 'localhost';

module.exports = {
  sftpConfig,
  upload,
  PORT
};