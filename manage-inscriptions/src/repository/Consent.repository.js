const fs = require('fs');
const FormData = require('form-data');
const httpClient = require('../utils/httpClient.js');
const ApiError = require('../exceptions/ApiError.js');

class ConsentRepository {
    async uploadConsent(file, username) {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path), file.originalname);
        form.append('username', username);
        const headers = form.getHeaders();

        try {
            console.log('Sending request to', `${httpClient.defaults.baseURL}/upload-consent`);
            console.log('File:', file.path, file.originalname);
            console.log('Username:', username);

            const { data } = await httpClient.post('/upload-consent', form, {
                headers,
                timeout: 30000,
            });
            return data;
        } catch (err) {
            console.error('Detail Error:', err);
            console.error('Response:', err.response?.data);

            const errorMessage = err.response?.data?.message || err.message;
            throw new ApiError(err.response?.status || 500, `Error uploading file: ${errorMessage}`);
        }
    }

    async findByFilename(filename) {
        try {
            const { data, headers } = await httpClient.get(`/consent/${filename}`, {
                responseType: 'arraybuffer',
                timeout: 30000,
            });

            return {
                data,
                contentType: headers['content-type'] || 'application/pdf',
                filename
            };
        } catch (err) {
            console.error('Detail Error:', err);
            console.error('Response:', err.response?.data);

            const errorMessage = err.response?.data?.message || err.message;
            throw new ApiError(err.response?.status || 500, `Error retrieving consent file: ${errorMessage}`);
        }
    }
}

module.exports = new ConsentRepository();

