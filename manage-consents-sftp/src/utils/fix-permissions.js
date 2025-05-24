const fs = require('fs');

/**
 * Sets appropriate permissions for uploaded files
 * @param {string} filePath - Path to the file
 * @returns {Promise} - Promise resolving when permissions are set
 */
const setFilePermissions = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.chmod(filePath, 0o644, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

/**
 * Removes a temporary file
 * @param {string} filePath - Path to the file to remove
 */
const removeTempFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error('Error removing temp file:', err);
    });
};

module.exports = {
    setFilePermissions,
    removeTempFile
};