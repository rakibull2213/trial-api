const mongoose = require('mongoose');
const connectDB = require('../../config/database');
const User = require('../../models/user');

mongoose.set('strictQuery', false);

exports.handler = async (event, context) => {
    await connectDB();

    const { userId, appName, description, trialStartDate, trialDuration } = JSON.parse(event.body);

    if (!userId || !appName || !trialStartDate || !trialDuration) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'All fields are required' }),
        };
    }

    const newUser = new User({
        userId,
        appName,
        description,
        trialStartDate: new Date(trialStartDate),
        trialDuration,
    });

    try {
        await newUser.save();
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'User created successfully',
                data: [
                    {
                        userId: userId,
                        appName: appName,
                        description: description,
                        trialStartDate: trialStartDate,
                        trialDuration: trialDuration
                    }
                ]
            }),
        };
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User ID already exists' }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal server error' }),
            };
        }
    }
};
