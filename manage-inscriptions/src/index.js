const mongoose = require('mongoose');
const { PORT, IP_ADDRESS, MONGO_URI } = require('./config/index.config.js');
const app = require('./app.js');

(async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
        app.listen(PORT, IP_ADDRESS, () => console.log(`Server running at http://${IP_ADDRESS}:${PORT}`));
    } catch (e) {
        console.error('Failed to start server', e);
        process.exit(1);
    }
})();