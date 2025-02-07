const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productsRoute = require("./routes/products");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const db = require("./db"); // Import database connection

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend requests
  credentials: true // Enable cookies in requests
}));
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Enables reading/writing cookies

// Define API routes
app.use("/api/products", productsRoute); // Product management routes
app.use("/api/auth", authRoutes); // Authentication routes

// Start server on port 5000 or the one defined in .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
