import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import JWT

/////////////////////Test registration route////////////////////////
const testRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

//////////////////// Test login route//////////////////////////////
const testLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

////////////////// Test route to check if the user is authenticated ////////////////////////
const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication not implemented" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res
      .status(200)
      .json({ message: "User is authenticated", userId: decoded.id });
  });
};

// Export functions at the end
export { testRegister, testLogin, checkAuth };
