const express = require("express"); // Import Express framework
const router = express.Router(); // Create an Express Router instance to handle product-related routes
const db = require("../db"); // Import the MySQL database connection

// **Route: Get All Products**
// This endpoint retrieves all products from the database and returns them as JSON.
router.get("/", async (req, res) => { 
  try {
    // Fetch all products from the "products" table in MySQL
    const [products] = await db.query("SELECT * FROM products"); 

    // Send the retrieved products as a JSON response to the frontend
    res.json(products);
  } catch (error) {
    // If an error occurs during database interaction, log the error
    console.error("Database Error:", error);

    // Return a 500 Internal Server Error response to the client
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Export the router so it can be used in the main application (index.js)
module.exports = router;
