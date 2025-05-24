const ApiError = require('./ApiError');

class DuplicateKeyError extends ApiError {
    constructor(message = 'Duplicate key error', field = null) {
        super(message);
        this.name = 'DuplicateKeyError';
        this.statusCode = 409; // Conflict
        this.field = field;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DuplicateKeyError;