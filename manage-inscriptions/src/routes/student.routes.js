const express = require('express');
const multer = require('multer');
const path = require('path');
const { create, getAllStudents, getStudentById, getConsentByStudentId } = require('../controllers/Student.controller.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../upload')),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', getAllStudents);
router.get('/:id_student', getStudentById);
router.get('/consent/:id_student', getConsentByStudentId);

router.post('/new-student', upload.single('file'), create);

module.exports = router;

