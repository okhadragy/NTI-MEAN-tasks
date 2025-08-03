const connectDB = require("../config/db");
const Course = require("../models/course.model");
const coursesData = require("./courses.json");

const insertCourses = async () => {
  try {
    await connectDB();
    await Course.insertMany(coursesData);
    console.log("Movies inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("Failed to insert courses:", error.message);
    process.exit(1);
  }
};

const deleteCourses = async () => {
  try {
    await connectDB();
    await Course.deleteMany();
    console.log("All courses deleted successfully.");
    process.exit();
  } catch (error) {
    console.error("Failed to delete courses:", error.message);
    process.exit(1);
  }
};

if (process.argv[2] === "--insert") {
  insertCourses();
} else if (process.argv[2] === "--delete") {
  deleteCourses();
} else {
  console.log("Unknown command. Use --insert or --delete");
  process.exit();
}
