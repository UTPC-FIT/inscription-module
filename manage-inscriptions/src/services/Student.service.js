const StudentRepository = require('../repository/Student.repository.js');
const ConsentRepository = require('../repository/Consent.repository.js');
const StudentDTO = require('../dtos/Student.DTO.js');

const ResourceNotFoundError = require('../exceptions/ResourceNotFoundError.js');

class StudentService {
    async createStudent({ id_student, emergency_contacts, file, username }) {
        // 1. Upload consent file to external API
        const consentResult = await ConsentRepository.uploadConsent(file, username);

        // 2. Prepare student data
        const studentRecord = {
            id_student,
            emergency_contacts,
            username, // Guardar también el username en la BD
            consent: {
                success: consentResult.success,
                filename: consentResult.filename,
                locations: {
                    api: consentResult.locations.api,
                    localPath: consentResult.locations.localPath,
                    relativePath: consentResult.locations.relativePath
                },
                message: consentResult.message
            }
        };

        // 3. Persist in MongoDB
        const created = await StudentRepository.create(studentRecord);

        // 4. Return DTO
        return new StudentDTO(created);
    }

    async getAllStudents() {
        const students = await StudentRepository.getAll();
        return students.map(student => new StudentDTO(student));
    }

    async getStudentById(id_student) {
        const student = await StudentRepository.findById(id_student);
        if (!student) {
            throw new ResourceNotFoundError(`Student with id ${id_student}`);
        }
        return new StudentDTO(student);
    }

    async getConsentByStudentId(id_student) {
        const student = await StudentRepository.findById(id_student);
        if (!student) {
            throw new ResourceNotFoundError(`Student with id ${id_student}`);
        }

        // 1. Check if the student has a consent
        if (!student.consent || !student.consent.filename) {
            throw new ResourceNotFoundError(`Consent not found for student with id ${id_student}`);
        }

        // 2. Retrieve the consent file from the repository
        const consent = await ConsentRepository.findByFilename(student.consent.filename);

        return consent;
    }

    async updateConsentApproval(id_student, approved, id_approved_by) {
        try {
            const updateData = {
                'consent.approved': approved,
            };

            if (approved) {
                updateData['consent.approvedAt'] = new Date();
                updateData['consent.id_approved_by'] = id_approved_by;
            } else {
                updateData['consent.approvedAt'] = null;
                updateData['consent.id_approved_by'] = null;
            }

            const result = await StudentRepository.findOneAndUpdate(
                { id_student },
                { $set: updateData },
                { new: true } // Return the updated document
            );

            if (!result) {
                throw new ResourceNotFoundError(`Student with id ${id_student} not found`);
            }

            return result.consent;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new ValidationError('Invalid student ID format');
            }
            throw error;
        }
    };

}

module.exports = new StudentService();
