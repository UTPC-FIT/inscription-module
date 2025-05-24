const multer = require('multer');
const sftpConfig = require('./sftp.config.js');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Server configuration
const PORT = process.env.PORT || 3000;
const IP_ADDRESS = process.env.IP_ADDRESS || 'localhost';

module.exports = {
  sftpConfig,
  upload,
  PORT,
  IP_ADDRESS,
};