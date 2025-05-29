const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number_contact: { type: Number, required: true },
    relationship: { type: String, required: true }
}, { _id: false });

const ConsentSchema = new mongoose.Schema({
    success: { type: Boolean, required: true },
    filename: { type: String, required: true },
    locations: {
        api: { type: String, required: true },
        localPath: { type: String, required: true },
        relativePath: { type: String, required: true }
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
    id_approved_by: { type: String, default: null },
    approvedAt: { type: Date, default: null },
}, { _id: false });

const StudentSchema = new mongoose.Schema({
    id_student: { type: String, required: true, unique: true, index: true },
    emergency_contacts: { type: [EmergencyContactSchema], required: true },
    consent: { type: ConsentSchema, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);

