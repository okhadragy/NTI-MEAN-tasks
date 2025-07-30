const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Course description is required"],
        minlength: [10, "Description should be at least 10 characters"]
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Instructor is required"]
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        enum: ["Computer Science", "Engineering", "Business", "Math", "Language", "Other"],
        default: "Other"
    },
    status: {
        type: String,
        enum: ["Not Started", "Planning", "Content Creation", "Review", "Completed"],
        default: "Not Started"
    },
    materials: [{
        title: { type: String, required: true },
        fileUrl: { type: String, required: true }
    }],
    curriculum: [{
        week: { type: Number, required: true },
        sessions: [{
            session_title: { type: String, required: true },
            duration: {
                type: Number,
                required: true,
                min: [1, "Duration must be at least 1 minute"]
            },
            content: { type: String, required: true },
            recordingUrl: {
                type: String,
                validate: {
                    validator: v => /^https?:\/\/.+/.test(v),
                    message: props => `${props.value} is not a valid URL`
                },
                required: false
            }
        }]
    }],
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

courseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Course', courseSchema);
