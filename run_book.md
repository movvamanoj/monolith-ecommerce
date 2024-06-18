Here's a detailed runbook for the monolithic Node.js e-commerce application we've created, containerized, and deployed. This runbook will cover everything from setting up the project to deploying it on Kubernetes.

## Monolith E-commerce Runbook

### Overview

This runbook provides a step-by-step guide to setting up, developing, containerizing, and deploying a monolithic Node.js e-commerce application. The application includes user registration, product management, and order creation features. It is containerized using Docker and deployed on Kubernetes.

### Project Structure

```plaintext
/monolith-ecommerce
├── /controllers
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── /models
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
├── /routes
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── app.js
├── package.json
├── Dockerfile
├── deployment.yaml
├── service.yaml
└── README.md
```

### Prerequisites

- Node.js
- npm
- Docker
- Kubernetes
- MongoDB

### Initial Setup

#### Step 1: Initialize the Project

1. Create the project directory:

    ```bash
    mkdir monolith-ecommerce
    cd monolith-ecommerce
    ```

2. Initialize a new Node.js project:

    ```bash
    npm init -y
    ```

3. Install necessary dependencies:

    ```bash
    npm install express mongoose
    ```

#### Step 2: Create Project Structure

1. Create directories for controllers, models, and routes:

    ```bash
    mkdir controllers models routes
    ```

2. Create the necessary files:

    ```bash
    ni .\controllers\userController.js, .\controllers\productController.js, .\controllers\orderController.js
    ni .\models\userModel.js, .\models\productModel.js, .\models\orderModel.js
    ni .\routes\userRoutes.js, .\routes\productRoutes.js, .\routes\orderRoutes.js
    ni .\app.js
    ```

### Implementation

#### Step 3: Implement Models

**userModel.js**

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

**productModel.js**

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
```

**orderModel.js**

```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
```

#### Step 4: Implement Controllers

**userController.js**

```javascript
const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
```

**productController.js**

```javascript
const Product = require('../models/productModel');

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};
```

**orderController.js**

```javascript
const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId').populate('productId');
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};
```

#### Step 5: Implement Routes

**userRoutes.js**

```javascript
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.registerUser);
router.get('/:id', userController.getUser);

module.exports = router;
```

**productRoutes.js**

```javascript
const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/', productController.addProduct);
router.get('/:id', productController.getProduct);

module.exports = router;
```

**orderRoutes.js**

```javascript
const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);

module.exports = router;
```

#### Step 6: Implement the main application file

**app.js**

```javascript
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Dockerization

#### Step 7: Create a Dockerfile

Create a `Dockerfile` in the root of the project:

```dockerfile
# Stage 1: Build the application
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source files
COPY . .

# Build the application (if applicable, e.g., for front-end projects)
# RUN npm run build

# Stage 2: Create a smaller image for running the application
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]

```

#### Step 8: Build and Run the Docker Image

1. Build the Docker image:

    ```bash
    docker build -t monolith-ecommerce .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 3000:3000 monolith-ecommerce
    ```




Sure, here's the resolution steps for the Docker build error related to DNS resolution in Markdown format:

```markdown
### Docker Build Error Resolution

If you encounter a Docker build error related to DNS resolution, follow these steps to resolve it:

#### Step 1: Update Docker's DNS Configuration

1. Create or update the `/etc/docker/daemon.json` file to include Google's DNS servers:

    ```json
    {
      "dns": ["8.8.8.8", "8.8.4.4"]
    }
    ```

2. Save the changes to the file.

#### Step 2: Restart the Docker Service

Restart the Docker service to apply the new DNS configuration:

```bash
sudo systemctl restart docker
```

#### Step 3: Reattempt the Docker Build

After updating Docker's DNS configuration, try building the Docker image again:

```bash
docker build -t monolith-ecommerce:latest .
```

If the issue persists or you encounter any other problems, further troubleshooting may be required.
```

You can add this Markdown content to your runbook to provide clear steps for resolving the Docker build error related to DNS resolution.


### Kubernetes Deployment

#### Step 9: Create Kubernetes Manifests

**deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: monolith-ecommerce
spec:
  replicas: 3
  selector:
    matchLabels:
      app: monolith-ecommerce
  template:
    metadata:
      labels:
        app: monolith-ecommerce
    spec:
      containers:
      - name: monolith-ecommerce
        image: monolith-ecommerce:latest
        ports:
        - containerPort: 3000
```

**service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: monolith-ecommerce
spec:
  selector:
    app: monolith-ecommerce
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
```

#### Step 10: Deploy to Kubernetes

Apply the manifests to your Kubernetes cluster:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service

.yaml
```

### GitHub Integration

#### Step 11: Create a `.gitignore` File

Create a `.gitignore` file in the root of your project directory:

```plaintext
# Node modules directory
node_modules/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov/

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt/

# Bower dependency directory (https://bower.io/)
bower_components/

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm/

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Parcel cache
.cache/

# Next.js build output
.next/

# Nuxt.js build output
.nuxt/

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp/
.cache/

# Docusaurus cache and generated files
.docusaurus/
.build/

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# VS Code directories
.vscode/
.history/

# macOS
.DS_Store

# dotenv environment variables file
.env
.env.*.local

# Docker
docker-compose.override.yml
Dockerfile*

# Windows
Thumbs.db
```

#### Step 12: Push to GitHub

1. Initialize Git:

    ```bash
    git init
    ```

2. Add files to the repository:

    ```bash
    git add .
    ```

3. Commit the changes:

    ```bash
    git commit -m "Initial commit with project structure and Docker configuration"
    ```

4. Create a GitHub repository named `monolith-ecommerce`.

5. Add the remote repository:

    ```bash
    git remote add origin https://github.com/movvamanoj/monolith-ecommerce.git
    ```

6. Push the changes to GitHub:

    ```bash
    git push -u origin main
    ```

### README.md

Here is the `README.md` file content:

```markdown
# Monolith E-commerce

![Monolith E-commerce](https://movva.club/logo.png)

This is a simple monolithic e-commerce application built with Node.js, Express, and MongoDB. The application includes user registration, product management, and order creation features. It is containerized using Docker and deployed on Kubernetes.

## Project Structure

```plaintext
/monolith-ecommerce
├── /controllers
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── /models
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
├── /routes
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── app.js
├── package.json
├── Dockerfile
├── deployment.yaml
└── service.yaml
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker
- Kubernetes
- MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/movvamanoj/monolith-ecommerce.git
    cd monolith-ecommerce
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the application:

    ```bash
    node app.js
    ```

## Docker

To build and run the Docker container:

1. Build the Docker image:

    ```bash
    docker build -t monolith-ecommerce .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 3000:3000 monolith-ecommerce
    ```

## Kubernetes

To deploy the application to a Kubernetes cluster:

1. Apply the deployment and service manifests:

    ```bash
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    ```

## API Endpoints

- **Register User**: `POST /users/register`
- **Get User**: `GET /users/:id`
- **Add Product**: `POST /products`
- **Get Product**: `GET /products/:id`
- **Create Order**: `POST /orders`
- **Get Order**: `GET /orders/:id`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Happy coding!*

![Monolith E-commerce](https://movva.club/footer-image.png)
```

This runbook provides a clear, detailed guide for the setup, development, containerization, and deployment of the monolithic Node.js e-commerce application. It ensures that all necessary steps are covered and the process is easy to follow.