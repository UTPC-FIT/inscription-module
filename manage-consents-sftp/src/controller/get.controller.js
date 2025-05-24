const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const { MissingParameterError } = require('../exceptions/upload.exceptions.js');
const { sftpConfig } = require('../config/index.config.js');
const { removeTempFile } = require('../utils/fix-permissions.js');

/**
 * Retrieve a consent file by name
 */
async function getConsentFile(req, res) {
    const fileName = req.params.fileName;
    if (!fileName) {
        throw new MissingParameterError('File name is required');
    }

    const sftp = new Client();
    const remotePath = path.posix.join(sftpConfig.remotePath, fileName);
    const localTempPath = path.join('tmp', fileName);

    try {
        await sftp.connect({
            host: sftpConfig.host,
            port: sftpConfig.port,
            username: sftpConfig.username,
            password: sftpConfig.password
        });

        // Check if file exists
        const fileExists = await sftp.exists(remotePath);
        if (!fileExists) {
            return res.status(404).send({ error: 'File not found' });
        }

        // Download to temp location
        await sftp.get(remotePath, localTempPath);

        // Send file to client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        const fileStream = fs.createReadStream(localTempPath);
        fileStream.pipe(res);

        // Clean up after sending
        fileStream.on('end', () => {
            removeTempFile(localTempPath);
        });
    } catch (err) {
        console.error('Error retrieving file:', err);
        res.status(500).send({ error: 'Error retrieving file' });
    } finally {
        await sftp.end();
    }
}

module.exports = {
    getConsentFile,
};