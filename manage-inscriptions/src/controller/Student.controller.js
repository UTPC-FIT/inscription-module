const StudentService = require('../services/StudentService.js');
const ApiError = require('../exceptions/ApiError.js');

exports.create = async (req, res, next) => {
    try {
        const { id_student, emergency_contacts } = req.body;
        const file = req.file;

        if (!file || !id_student || !emergency_contacts) {
            throw new ApiError(400, 'id_student, emergency_contacts and file are required');
        }

        const contacts = Array.isArray(emergency_contacts)
            ? JSON.parse(emergency_contacts)
            : JSON.parse(emergency_contacts);

        const studentDto = await StudentService.createStudent({ id_student, emergency_contacts: contacts, file });
        res.status(201).json(studentDto);
    } catch (err) {
        next(err);
    }
};