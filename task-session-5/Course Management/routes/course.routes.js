const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require('../controllers/course.controller');

const router = express.Router();

router
    .route('/')
    .post(createCourse)
    .get(getAllCourses);
router
    .route('/:id')
    .get(getCourseById)
    .patch(updateCourse)
    .delete(deleteCourse);

module.exports = router;
