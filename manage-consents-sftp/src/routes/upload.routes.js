const express = require('express');
const router = express.Router();
const { upload } = require('../config/index.config.js');
const { uploadConsent } = require('../controller/upload.controller.js');
const { getConsentFile } = require('../controller/get.controller.js');

// Error handling middleware
const asyncHandler = fn => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

// Upload consent PDF route
router.post('/upload-consent', upload.single('pdf'), asyncHandler(uploadConsent));

// Get consent PDF by filename
router.get('/file/:fileName', asyncHandler(getConsentFile));

module.exports = router;