const express = require('express');
const multer = require('multer');
const path = require('path');
const { create } = require('../controllers/Student.controller.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../upload')),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();
router.post('/', upload.single('file'), create);

module.exports = router;

