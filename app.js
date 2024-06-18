// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Import route handlers
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Create an Express application instance
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection configuration
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1); // Exit the application if MongoDB connection fails
});

// Mount route handlers
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
