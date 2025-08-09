const mongoose = require('mongoose');
const User = require('./user.model');
const Course = require('./course.model');
const LiveCourseRun = require('./liveCourseRun.model');

const contentProgressSchema = new mongoose.Schema({
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the session/quiz/assessment
    type: { type: String, enum: ['session', 'quiz', 'assessment'], required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, min: 0, max: 100 },
    passed: { type: Boolean }
}, { _id: false });

const sectionProgressSchema = new mongoose.Schema({
    sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    contents: [contentProgressSchema]
}, { _id: false });

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required"],
        validate: {
            validator: async function (userId) {
                return await User.exists({ _id: userId });
            },
            message: "User does not exist"
        }
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Course is required"],
        validate: {
            validator: async function (courseId) {
                return await Course.exists({ _id: courseId });
            },
            message: "Course does not exist"
        }
    },
    liveRun: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveCourseRun',
        validate: {
            validator: async function (id) {
                if (!id) return true;
                return await LiveCourseRun.exists({ _id: id });
            },
            message: 'Live course run does not exist'
        }
    },
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    sectionsProgress: {
        type: [sectionProgressSchema],
        validate: {
            validator: async function (sections) {
                if (!this.course) return false;

                const course = await Course.findById(this.course).lean();
                if (!course) return false;

                const courseSectionIds = course.curriculum.map(s => s._id.toString());

                // Ensure every section belongs to this course
                for (const sec of sections) {
                    if (!courseSectionIds.includes(sec.sectionId.toString())) {
                        return false;
                    }

                    // Get this section’s valid content IDs
                    const courseSection = course.curriculum.find(s => s._id.toString() === sec.sectionId.toString());
                    const validContentIds = [
                        ...(courseSection.sessions || []).map(c => c._id.toString()),
                        ...(courseSection.quizzes || []).map(c => c._id.toString()),
                        ...(courseSection.assessments || []).map(c => c._id.toString())
                    ];

                    // Ensure every content belongs to this section
                    for (const content of sec.contents) {
                        if (!validContentIds.includes(content.contentId.toString())) {
                            return false;
                        }
                    }
                }
                return true;
            },
            message: "Section or content progress does not match the course structure"
        }
    },
    lastAccessed: { type: Date }
}, { timestamps: true });

enrollmentSchema.pre('save', function (next) {
    if (!this.sectionsProgress || this.sectionsProgress.length === 0) {
        this.progress = 0;
        return next();
    }

    let totalContents = 0;
    let completedContents = 0;

    this.sectionsProgress.forEach(section => {
        section.contents.forEach(content => {
            totalContents++;
            if (content.completed && (content.type !== 'assessment' || content.passed)) {
                completedContents++;
            }
        });
    });

    this.progress = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;
    next();
});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
