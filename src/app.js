const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API!');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
