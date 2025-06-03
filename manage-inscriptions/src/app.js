const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/student.routes');
const { allowedOrigins } = require('./config/index.config');

const app = express();


const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', (req, res, next) => {
    console.log(`Request received at microservice: ${req.method} ${req.originalUrl}`);
    console.log(`Request body:`, req.body);
    next();
}, studentRoutes);

// Global error handler
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
});

module.exports = app;
