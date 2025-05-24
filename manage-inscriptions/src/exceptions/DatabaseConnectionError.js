const ApiError = require('./ApiError');

class DatabaseConnectionError extends ApiError {
    constructor(message = 'Database connection error') {
        super(503, message); // 503 Service Unavailable
        this.name = 'DatabaseConnectionError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DatabaseConnectionError;