const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const { sftpConfig } = require('../config/sftp.config.js');
const { removeTempFile } = require('../utils/fix-permissions.js');
const { FileNotFoundError, MissingParameterError } = require('../exceptions/upload.exceptions.js');

/**
 * Handle consent form upload
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

    // Create filename: username + "consent" + timestamp + extension
    const remoteFileName = `${username}_consent_${timestamp}${fileExtension}`;
    const remotePath = path.posix.join(sftpConfig.remotePath, remoteFileName);

    const sftp = new Client();
    try {
        // Connect to SFTP
        await sftp.connect({
            host: sftpConfig.host,
            port: sftpConfig.port,
            username: sftpConfig.username,
            password: sftpConfig.password
        });

        // Upload file
        await sftp.put(localPath, remotePath);
        res.send({
            success: true,
            filename: remoteFileName,
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
    getConsentFile
};