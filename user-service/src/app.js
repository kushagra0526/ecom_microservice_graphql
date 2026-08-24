const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection string — supports both MONGO_URI and MONGODB_URI for flexibility
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);  // Exit process with failure if DB connection fails
  });

// Routes (prefix the routes with '/users')
app.use('/users', userRoutes);

// Start Kafka consumer
require('./events/userConsumer');

// Start server on the specified port
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing the server...');
  await mongoose.connection.close();  // Close the MongoDB connection gracefully
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = server; // Export server instance for testing
