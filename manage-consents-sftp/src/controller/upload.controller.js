const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const { sftpConfig } = require('../config/index.config.js');
const { removeTempFile } = require('../utils/fix-permissions.js');
const {
    FileNotFoundError,
    MissingParameterError,
    DuplicateKeyError
} = require('../exceptions/upload.exceptions.js');

/**
 * Uploads a consent file to the SFTP server
 * @param {Object} req - Express request object
 * @param {Object} req.file - The uploaded file object from multer middleware
 * @param {string} req.file.path - Temporary path of uploaded file
 * @param {string} req.file.originalname - Original name of uploaded file
 * @param {Object} req.body - Request body object
 * @param {string} req.body.username - Username of the user uploading the consent
 * @param {Object} res - Express response object
 * @returns {Object} Response object containing:
 *   - success {boolean} - Indicates if upload was successful
 *   - filename {string} - Name of the uploaded file
 *   - locations {Object} - Object containing various file paths:
 *     - api {string} - API endpoint to retrieve the file
 *     - localPath {string} - Absolute path on host machine
 *     - relativePath {string} - Relative path within project
 *   - message {string} - Success message with filename
 * @throws {FileNotFoundError} When no file is uploaded
 * @throws {MissingParameterError} When username is missing
 * @throws {Error} When SFTP operations fail
 */
async function uploadConsent(req, res) {
    // Validate file exists
    if (!req.file) {
        throw new FileNotFoundError();
    }

    // Validate username parameter
    if (!req.body.username) {
        throw new MissingParameterError('Username is required');
    }

    const localPath = req.file.path;
    const username = req.body.username;
    const timestamp = Date.now();
    const fileExtension = path.extname(req.file.originalname);

    const sftp = new Client();
    try {
        // Connect to SFTP
        await sftp.connect({
            host: sftpConfig.host,
            port: sftpConfig.port,
            username: sftpConfig.username,
            password: sftpConfig.password
        });

        // Check if a file for this username already exists
        const uploadDir = 'upload/';
        const fileList = await sftp.list(uploadDir);
        const existingFile = fileList.find(file =>
            file.name.startsWith(`${username}_consent_`)
        );

        if (existingFile) {
            throw new DuplicateKeyError(`A consent file already exists for user ${username}`);
        }

        // Create filename and continue with upload
        const remoteFileName = `${username}_consent_${timestamp}${fileExtension}`;
        const remotePath = remoteFileName;
        const finalRemotePath = `upload/${remotePath}`;

        // Continue with the rest of your existing upload logic
        console.log(`Uploading to: ${finalRemotePath}`);
        await sftp.put(localPath, finalRemotePath);

        // Get the current working directory for absolute path reference
        const projectRoot = process.cwd();
        const absoluteFilePath = `${projectRoot}/upload/${remoteFileName}`;

        // Simplified response with the most useful locations
        res.send({
            success: true,
            filename: remoteFileName,
            locations: {
                // API endpoint to retrieve the file
                api: `/file/${remoteFileName}`,

                // Path on host machine (your computer)
                localPath: absoluteFilePath,

                // Relative path (useful for referencing within the project)
                relativePath: `./upload/${remoteFileName}`
            },
            message: `Consent PDF uploaded successfully as ${remoteFileName}`
        });
    } catch (err) {
        console.error('SFTP Error:', err);
        throw err;
    } finally {
        // Close connection and delete temp file
        await sftp.end();
        removeTempFile(localPath);
    }
}

module.exports = {
    uploadConsent,
};