const StudentService = require('../services/Student.service.js');
const ApiError = require('../exceptions/ApiError.js');
const DuplicateKeyError = require('../exceptions/DuplicateKeyError.js');

exports.create = async (req, res, next) => {
    try {
        const { id_student, emergency_contacts, username } = req.body;
        const file = req.file;

        if (!file || !id_student || !emergency_contacts || !username) {
            throw new ApiError(400, 'id_student, emergency_contacts, username and file are required');
        }

        const contacts = Array.isArray(emergency_contacts)
            ? emergency_contacts
            : JSON.parse(emergency_contacts);

        const studentDto = await StudentService.createStudent({ id_student, emergency_contacts: contacts, file, username });
        res.status(201).json(studentDto);
    } catch (err) {
        if (err instanceof DuplicateKeyError) {
            return res.status(409).json({
                message: err.message,
                field: err.field
            });
        }
        console.error(err);
        next(err);
    }
};