const ApiError = require('./ApiError');

class DuplicateKeyError extends ApiError {
    constructor(message, field = null) {
        super(409, message); // 409 Conflict es el código apropiado para conflictos de recursos
        this.field = field;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DuplicateKeyError;