const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    description: { type: String, required: false },
    trialStartDate: { type: Date, required: true },
    trialDuration: { type: Number, required: true }, // in days
});

const User = mongoose.model('User', userSchema);

module.exports = User;
