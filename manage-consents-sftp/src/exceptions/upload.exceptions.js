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

module.exports = {
    FileUploadError,
    FileNotFoundError,
    MissingParameterError
};