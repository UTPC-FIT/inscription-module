const express = require('express');
const { PORT, IP_ADDRESS, BASE_API } = require('./config/index.config.js');
const uploadRoutes = require('./routes/upload.routes.js');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(BASE_API, uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send({
        error: err.message || 'Internal Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://${IP_ADDRESS}:${PORT}`);
});