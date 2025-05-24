const ApiError = require('./ApiError');

class ValidationError extends ApiError {
    constructor(message = 'Validation error', errors = {}) {
        super(400, message);
        this.name = 'ValidationError';
        this.errors = errors; // Store validation errors details
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ValidationError;