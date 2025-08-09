const express = require("express");
const userControllers = require("../controllers/user.controller");
const multer = require('multer');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split('/')[0];
  if (
    type === 'image'
  ) {
    cb(null, true);
  } else {
    cb(new Error('❌ Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });
router.post("/signup", userControllers.signup, upload.single('photo'));
router.get("/", userControllers.getAllUsers);
router.post("/login", userControllers.login);
router.post(
  "/favoriteCourses",
  userControllers.protectRoutes,
  userControllers.addCourseToFav
);

module.exports = router;
