const fs = require("fs"); // Import File System module to read files
const path = require("path"); // Import Path module to work with file paths
const connection = require("./db"); // Import MySQL database connection

// Read the JSON file
// Reads the `products.json` file and parses its contents into a JavaScript object.
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "products.json"), "utf8"));

// Format product data for SQL insertion
const formattedProducts = products.map(product => [
    product.title, // Product name
    product.description, // Product description
    parseFloat(product.price.replace(/[$,]/g, "")), // Convert "$549.99" → 549.99 for numeric storage
    product.image // Image URL
]);

// Define SQL Query for Batch Insertion
// Uses MySQL's bulk insert syntax to insert multiple rows in a single query.
const insertQuery = "INSERT INTO products (title, description, price, image) VALUES ?";

// Execute the Insertion Query
connection.query(insertQuery, [formattedProducts], (err, result) => {
  if (err) {
    console.error("Error inserting data:", err); // Log error if insertion fails
    return;
  }
  console.log(`Successfully inserted ${result.affectedRows} products.`);
  connection.end(); // Close the database connection after insertion
});
