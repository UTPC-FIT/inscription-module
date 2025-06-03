const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    create,
    getAllStudents,
    getStudentById,
    getConsentByStudentId,
    isConsentValid,
    updateConsentApproval,
    assignRoleToUser,
} = require('../controllers/Student.controller.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../upload')),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();

router.get('/students', getAllStudents);
router.get('/students/:id_student', getStudentById);
router.get('/consent/:id_student', getConsentByStudentId);

router.get('/consent/valid/:id_student', isConsentValid);

router.post('/register', upload.single('file'), create);

router.patch('/officials/consent/:id_student/approval', updateConsentApproval);

module.exports = router;