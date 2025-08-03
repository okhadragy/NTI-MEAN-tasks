const mongoose = require('mongoose');
const User = require('../models/user.model')
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME,
        });

        const existingInstructor = await User.findOne({ email: 'john.doe@example.com' });

        if (!existingInstructor) {
            const instructor = new User({
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'instructor',
                password: 'Test123', 
            });

            await instructor.save();
            console.log('✅ Instructor created:', instructor);
        } else {
            console.log('⚠️ Instructor already exists.');
        }

        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
