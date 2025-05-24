const StudentRepository = require('../repository/StudentRepository.js');
const ConsentRepository = require('../repository/ConsentRepository.js');
const StudentDTO = require('../dtos/StudentDTO.js');

class StudentService {
    async createStudent({ id_student, emergency_contacts, file }) {
        // 1. Upload consent file to external API
        const consentResult = await ConsentRepository.uploadConsent(file);

        // 2. Prepare student data
        const studentRecord = {
            id_student,
            emergency_contacts,
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
