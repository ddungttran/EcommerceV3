const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const db = require("../db"); // Import database connection

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey"; // Secret key for JWT signing

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) return res.status(400).json({ message: "User already exists" });

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    await db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from the database
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = rows[0];

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "3h" });

    // Store token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3 * 60 * 60 * 1000, // 3-hour expiration
    });

    res.json({ message: "Login successful!" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to Protect Routes
const authenticateUser = (req, res, next) => {
  console.log("Received cookies:", req.cookies);
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store decoded user ID in the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get User Profile (Protected Route)
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [req.user.id]);

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(rows[0]); // Return user details
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
