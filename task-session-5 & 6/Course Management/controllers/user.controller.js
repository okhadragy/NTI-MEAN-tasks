const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: false, __v: false });
    res
      .status(200)
      .json({ status: "success", length: users.length, data: { users } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const signup = async (req, res) => {
  try {
    let { password, confirmPassword, photo, name, email } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }
    password = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password, photo });

    // jwt
    const token = jwt.sign(
      { id: user._id, name: name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .status(201)
      .json({ status: "success", token: token, data: { user: user } });
  } catch (error) {
    res
      .status(400)
      .json({ status: "fail", message: `Error in Sign up ${error.message}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Email or Password is missing" });
  }

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(404).json({
      status: "fail",
      message: "User not exists",
    });
  }

  const matchedPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchedPassword) {
    return res.status(404).json({
      status: "fail",
      message: "User not exists",
    });
  }
  const token = jwt.sign(
    { id: existingUser._id, name: existingUser.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return res.status(200).json({
    status: "success",
    token: token,
    data: { user: { name: existingUser.name, email } },
  });
};

const protectRoutes = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }
    if (!token) {
    return  res
        .status(400)
        .json({ status: "fail", message: "Your are not logged in" });
    }
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
   req.userId = decodedToken.id
    next();
  } catch (error) {
    res.status(401).json({ status: "fail", message: error.message });
  }
};


const addCourseToFav = async (req, res) => {
  try {
    
    const userId = req.userId; 
    const { courseId } = req.body;

    if (!movieId) {
      return res.status(400).json({ status: "fail", message: "Course ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (!user.favCourses.includes(courseId)) {
      user.favCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({ status: "success", data: { favCourses: user.favCourses } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};


module.exports = { signup, getAllUsers, login, protectRoutes , addCourseToFav};
