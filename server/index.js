const app = require('./app');
const connectDB = require('./models/db');
const { PORT } = require('./config/config');
const { init } = require('./controllers/passwordController');

async function startServer() {
    try {
        const db = await connectDB();
        init(db);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
}

startServer();
