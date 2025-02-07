const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productsRoute = require("./routes/products");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const db = require("./db"); // Import database connection

const app = express();

// Define the allowed origins
const allowedOrigins = [
  "http://localhost:5173",              // Local development
  "https://ecommercev3-view.onrender.com" // Deployed frontend URL
];

// Configure CORS to allow requests from the allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If the incoming origin is not allowed, return an error
        return callback(
          new Error("CORS policy does not allow access from this origin: " + origin),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true, // Enable cookies in requests
  })
);

app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Enable reading/writing cookies

// Define API routes
app.use("/api/products", productsRoute); // Product management routes
app.use("/api/auth", authRoutes); // Authentication routes

// Start server on port defined in .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
