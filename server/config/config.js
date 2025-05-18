require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL,
    DB_NAME: 'passfort',
};
