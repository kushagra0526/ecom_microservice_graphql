const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined. Please check your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Order routes
app.use('/orders', orderRoutes);

// Start Kafka consumer
require('./events/orderConsumer');

// 404 for unmatched routes
app.use((req, res) => res.status(404).json({ error: 'Route not found', status: 404 }));

// Centralized error handler
app.use(require('./middleware/errorHandler'));

// Start the server
const port = process.env.PORT || 3003;
const server = app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing the server...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = server; // Export the server instance
