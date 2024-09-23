/////////////////////////////// Imports /////////////////////////////////////////
import User from "../models/user.js";
import { registerSchema, loginSchema } from "../validation/schemas.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

///////////////////////// Register User ////////////////////////////////////////
const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
};

/////////////////////////// Login User /////////////////////////////////////////
const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body; //destructuring from req.body
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  //here  we are using JWT (JSON web token) here
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  //using cookies to store JWT token
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "Login successful",
    user: { name: user.name, email: user.email },
  });
};

/////////////////////////////// LogOut User /////////////////////////////////////////////////
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

/////////////////////////// Check Authenticatin ////////////////////////////////////////////
const checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.status(200).json({ message: "Authentication is working." });
  });
};

///////////////////////////// export //////////////////////////////////////////////////
export { registerUser, loginUser, logoutUser, checkAuth };
