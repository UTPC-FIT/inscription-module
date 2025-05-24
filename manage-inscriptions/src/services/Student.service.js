const StudentRepository = require('../repository/Student.repository.js');
const ConsentRepository = require('../repository/Consent.repository.js');
const StudentDTO = require('../dtos/Student.DTO.js');

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
}

module.exports = new StudentService();
