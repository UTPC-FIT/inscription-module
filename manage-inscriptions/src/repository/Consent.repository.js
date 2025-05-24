const fs = require('fs');
const FormData = require('form-data');
const httpClient = require('../utils/httpClient.js');
const ApiError = require('../exceptions/ApiError.js');

class ConsentRepository {
    async uploadConsent(file) {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path), file.originalname);
        const headers = form.getHeaders();

        try {
            const { data } = await httpClient.post('/upload-consent', form, { headers });
            return data[0];
        } catch (err) {
            throw new ApiError(err.response?.status || 500, err.message);
        }
    }
}

module.exports = new ConsentRepository();

