const StudentService = require('../services/Student.service.js');
const ApiError = require('../exceptions/ApiError.js');
const DuplicateKeyError = require('../exceptions/DuplicateKeyError.js');
const ResourceNotFoundError = require('../exceptions/ResourceNotFoundError');
const InternalServerError = require('../exceptions/InternalServerError');
const ValidationError = require('../exceptions/ValidationError.js');

exports.create = async (req, res, next) => {
    try {
        const { id_student, emergency_contacts, username } = req.body;
        const file = req.file;

        if (!file || !id_student || !emergency_contacts || !username) {
            throw new ValidationError('id_student, emergency_contacts, username and file are required');
        }

        const contacts = Array.isArray(emergency_contacts)
            ? emergency_contacts
            : JSON.parse(emergency_contacts);

        const studentDto = await StudentService.createStudent({ id_student, emergency_contacts: contacts, file, username });
        res.status(201).json(studentDto);
    } catch (err) {
        if (err instanceof DuplicateKeyError) {
            return res.status(err.statusCode).json({
                message: err.message,
                field: err.field
            });
        }
        console.error(err);
        next(err);
    }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const students = await StudentService.getAllStudents();

        if (!students || students.length === 0) {
            throw new ResourceNotFoundError('Students');
        }

        res.status(200).json(students);
    } catch (err) {
        console.error(err);

        // Let the error middleware handle these specific errors
        if (err instanceof ApiError) {
            return next(err);
        }

        // Convert other errors to InternalServerError
        next(new InternalServerError('Error retrieving students'));
    }
}

exports.getStudentById = async (req, res, next) => {
    try {
        const { id_student } = req.params;

        if (!id_student) {
            throw new ValidationError('id_student is required');
        }

        const student = await StudentService.getStudentById(id_student);

        if (!student) {
            throw new ResourceNotFoundError(`Student with id ${id_student}`);
        }

        res.status(200).json(student);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.getConsentByStudentId = async (req, res, next) => {
    try {
        const { id_student } = req.params;

        if (!id_student) {
            throw new ValidationError('id_student is required');
        }

        const consent = await StudentService.getConsentByStudentId(id_student);

        if (!consent) {
            throw new ResourceNotFoundError(`Consent for student with id ${id_student}`);
        }

        // Set appropriate headers for PDF display
        res.setHeader('Content-Type', consent.contentType);
        res.setHeader('Content-Disposition', `inline; filename="${consent.filename}"`);

        // Send the binary data directly to client
        return res.send(consent.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
}