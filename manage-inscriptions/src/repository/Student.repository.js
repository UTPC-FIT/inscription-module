const Student = require('../models/Student.model.js');
const DuplicateKeyError = require('../exceptions/DuplicateKeyError.js');

class StudentRepository {
    async create(studentData) {
        try {
            return await Student.create(studentData);
        } catch (err) {
            if (err.code === 11000) {
                const field = Object.keys(err.keyPattern)[0];
                const value = err.keyValue[field];
                throw new DuplicateKeyError(
                    `Student with ${field} '${value}' already exists`,
                    field
                );
            }
            throw err;
        }
    }

    async findById(id_student) {
        return Student.findOne({ id_student });
    }

    async getAll() {
        return Student.find();
    }
}

module.exports = new StudentRepository();
