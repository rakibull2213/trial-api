const mongoose = require('mongoose');
const connectDB = require('../../config/database');
const User = require('../../models/user');

mongoose.set('strictQuery', false);

exports.handler = async (event, context) => {
    await connectDB();

    const userId = event.queryStringParameters.userId;
    const user = await User.findOne({ userId });

    if (!user) {
        return {
            statusCode: 404,
            body: JSON.stringify({ valid: false, message: 'User not found' }),
        };
    }

    const currentDate = new Date();
    const trialEndDate = new Date(user.trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + user.trialDuration);

    const isValid = currentDate < trialEndDate;
    return {
        statusCode: 200,
        body: JSON.stringify({
            valid: isValid,
            message: isValid ? 'User trial is still active' : 'User trial has expired',
            data: {
                userId: user.userId,
                appName: user.appName,
                description: user.description,
                trialStartDate: user.trialStartDate,
                trialEndDate: trialEndDate,
                currentDate: currentDate,
                reminder: isValid ? `Trial ends in ${Math.ceil((trialEndDate - currentDate) / (1000 * 60 * 60 * 24))} days` : 'Trial has ended already'
            }
        }),
    };
};
