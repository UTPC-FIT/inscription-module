const Student = require('../models/Student');

class StudentRepository {
    async create(studentData) {
        return Student.create(studentData);
    }
    async findById(id_student) {
        return Student.findOne({ id_student });
    }
}

module.exports = new StudentRepository();
