class StudentDTO {
    constructor({ id_student, emergency_contacts, consent }) {
        this.id_student = id_student;
        this.emergency_contacts = emergency_contacts;
        this.consent = consent;
    }
}

module.exports = StudentDTO;

