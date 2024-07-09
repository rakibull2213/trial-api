require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const connectDB = require('./config/database');

module.exports = async (event, context) => {
    await connectDB();
};
