const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
const mongoURI = process.env.MONGO_URI; // Get MongoDB URI from environment variables

// Check if the URI is defined
if (!mongoURI) {
    console.error('Error: MONGO_URI is not defined. Please check your .env file.');
    process.exit(1); // Exit the application if MONGO_URI is not set
}

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Use product routes
app.use('/products', productRoutes);

// Start the server
const port = process.env.PORT || 3002; // Change the port as needed
const server = app.listen(port, () => {
    console.log(`Product service running on port ${port}`);
});

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Closing the server...');
    await mongoose.connection.close(); // Close the MongoDB connection
    process.exit(0); // Exit the application
});

// Export the server for testing
module.exports = server; // Exporting the server instance for testing purposes
