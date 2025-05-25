class FileUploadError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileUploadError';
        this.statusCode = 500;
    }
}

class FileNotFoundError extends Error {
    constructor(message) {
        super(message || 'No file was uploaded');
        this.name = 'FileNotFoundError';
        this.statusCode = 400;
    }
}

class MissingParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingParameterError';
        this.statusCode = 400;
    }
}

class DuplicateKeyError extends Error {
    constructor(message) {
        super(message || 'A file with this username already exists');
        this.name = 'DuplicateKeyError';
        this.statusCode = 409;
        console.error(this.message);
    }
}

module.exports = {
    FileUploadError,
    FileNotFoundError,
    MissingParameterError,
    DuplicateKeyError,
};