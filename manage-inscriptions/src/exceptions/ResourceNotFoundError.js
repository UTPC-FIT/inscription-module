const ApiError = require('./ApiError');

class ResourceNotFoundError extends ApiError {
    constructor(resource = 'Resource', message = null) {
        super(404, message || `${resource} not found`);
        this.name = 'ResourceNotFoundError';
        this.resource = resource;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ResourceNotFoundError;