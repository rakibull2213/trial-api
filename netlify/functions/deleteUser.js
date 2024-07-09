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
            body: JSON.stringify({ message: 'User not found' }),
        };
    }

    try {
        await User.deleteOne({ userId });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User deleted successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
