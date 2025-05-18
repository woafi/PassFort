const express = require('express');
const cors = require('cors');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', passwordRoutes);

module.exports = app;
