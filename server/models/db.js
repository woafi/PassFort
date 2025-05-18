const { MongoClient } = require('mongodb');
const { MONGODB_URL, DB_NAME } = require('../config/config');

const client = new MongoClient(MONGODB_URL);

async function connectDB() {
    try {
        // await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(DB_NAME);
        return db;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

module.exports = connectDB;
