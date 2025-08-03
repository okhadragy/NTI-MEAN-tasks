const mongoose = require('mongoose');
const Course = require('../models/course.model');

const createCourse = async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", Course: newCourse });
    } catch (error) {
        console.error("Error creating Course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllCourses = async (req, res) => {
    try {
        const Courses = await Course.find().populate('instructor','name email role');
        res.status(200).json({ status: "success", length: Courses.length, data: Courses });
    } catch (error) {
        console.error("Error fetching Courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getCourseById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ status: "fail", message: "Invalid Course ID" });
        }
        const course = await Course.findById(req.params.id).populate('instructor','name email role');
        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }
        res.status(200).json({ status: "success", data: course });
    } catch (error) {
        console.error("Error fetching Course:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}


const updateCourse = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ status: "fail", message: "Invalid Course ID" });
        }
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCourse) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }
        res.status(200).json({ status: "success", data: updatedCourse });
    } catch (error) {
        console.error("Error updating Course:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

const deleteCourse = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ status: "fail", message: "Invalid Course ID" });
        }
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }
        res.status(200).json({ status: "success", message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting Course:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};