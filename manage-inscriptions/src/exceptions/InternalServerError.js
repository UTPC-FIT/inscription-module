const ApiError = require('./ApiError');

class InternalServerError extends ApiError {
    constructor(message = 'Internal server error') {
        super(500, message);
        this.name = 'InternalServerError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InternalServerError;