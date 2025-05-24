const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const { sftpConfig } = require('../config/index.config.js');
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

    // Important: Make sure this path matches exactly with how the volume is mounted
    // in the SFTP container. Based on your error, change this to just the filename
    const remotePath = remoteFileName;

    const sftp = new Client();
    try {
        // Connect to SFTP
        await sftp.connect({
            host: sftpConfig.host,
            port: sftpConfig.port,
            username: sftpConfig.username,
            password: sftpConfig.password
        });

        // IMPORTANT CHANGE: Don't try to create directories
        // The upload directory is already mounted in docker-compose.yml

        // Use the upload directory directly - it's already mounted
        const finalRemotePath = `upload/${remotePath}`;
        console.log(`Uploading to: ${finalRemotePath}`);

        // Upload the file
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