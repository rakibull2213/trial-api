const mongoose = require('mongoose');
const connectDB = require('../../config/database');
const User = require('../../models/user');

mongoose.set('strictQuery', false);

exports.handler = async (event, context) => {
    await connectDB();

    const users = await User.find();
    users.sort((a, b) => a.trialStartDate - b.trialStartDate);

    if (!users) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'No user found' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            Total: users.length,
            data: users.map(user => ({
                userId: user.userId,
                appName: user.appName,
                description: user.description,
                trialStartDate: user.trialStartDate,
                trialDuration: user.trialDuration,
                reminder: `Trial ends in ${Math.ceil((new Date(user.trialStartDate).setDate(new Date(user.trialStartDate).getDate() + user.trialDuration) - new Date()) / (1000 * 60 * 60 * 24))} days`
            }))
        }),
    };
};
