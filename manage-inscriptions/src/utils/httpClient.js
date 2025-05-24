const axios = require('axios');
const { endpointsConsents } = require('../config/index.config.js');

const httpClient = axios.create({
    baseURL: endpointsConsents.upload.replace('/upload-consent', ''),
    timeout: 5000,
});

module.exports = httpClient;