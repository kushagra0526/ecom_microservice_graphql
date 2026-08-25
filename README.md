<div align="center">

# 🛒 E-Commerce Microservices Platform

**Production-ready microservices architecture with GraphQL gateway, event-driven communication, and enterprise-grade security.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Gateway-e10098.svg)](https://graphql.org/)

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Testing](#-testing) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

A **scalable e-commerce backend** built with microservices architecture, featuring isolated services for users, products, and orders. Each service is independently deployable, with event-driven communication via Kafka and a unified GraphQL gateway for flexible data fetching.

### Why This Architecture?

- **🔄 Scalability**: Scale services independently based on traffic patterns
- **🛡️ Resilience**: Service failures are isolated with circuit breaker patterns
- **⚡ Performance**: Event-driven async communication reduces latency
- **🔐 Security**: JWT authentication, rate limiting, and input validation on all endpoints
- **📊 Observability**: Structured logging with Pino for production monitoring
- **🚀 Developer Experience**: Hot reload, Swagger docs, automated tests, CI/CD ready

---

## ✨ Features

### Core Capabilities

- ✅ **User Management** - Registration, authentication, JWT-based authorization
- ✅ **Product Catalog** - CRUD operations with pagination and filtering
- ✅ **Order Processing** - Cross-service validation with inventory checks
- ✅ **GraphQL Gateway** - Unified API with flexible queries and mutations
- ✅ **Event Streaming** - Kafka-powered async communication between services

### Enterprise Features

- 🔒 **Security First** - JWT auth, bcrypt password hashing, rate limiting (100 req/15min)
- 📝 **Input Validation** - Joi schemas on all endpoints with detailed error messages
- 🏥 **Health Checks** - Dedicated endpoints for monitoring and orchestration
- 📖 **API Documentation** - Interactive Swagger UI for all REST endpoints
- 🔍 **Structured Logging** - JSON logs with request tracing and sensitive data redaction
- ⚠️ **Error Handling** - Centralized middleware with consistent error responses
- 🧪 **Test Coverage** - Unit and integration tests with Jest and Supertest
- 🔄 **CI/CD Ready** - GitHub Actions workflow for automated testing

---

## 🏗️ Architecture

### System Design

```
┌─────────────┐
│   Clients   │
│ (Web, Mobile)│
└──────┬──────┘
       │
       ▼
┌──────────────────┐        ┌─────────────────┐
│  GraphQL Gateway │◄───────┤  REST Clients   │
│    (Port 4000)   │        │  (Postman, etc) │
└────────┬─────────┘        └─────────────────┘
         │
    ┌────┴─────────┬──────────────┐
    │              │              │
    ▼              ▼              ▼
┌────────┐    ┌──────────┐   ┌──────────┐
│  User  │    │ Product  │   │  Order   │
│Service │    │ Service  │   │ Service  │
│  3001  │    │   3002   │   │   3003   │
└───┬────┘    └─────┬────┘   └────┬─────┘
    │               │              │
    └───────┬───────┴──────┬───────┘
            │              │
        ┌───▼────┐    ┌────▼────┐
        │ Kafka  │    │ MongoDB │
        │ Broker │    │ Cluster │
        └────────┘    └─────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
| ------- | ----------- | --------- |
| **API Gateway** | GraphQL (Apollo Server) | Unified query interface |
| **Services** | Node.js + Express | RESTful microservices |
| **Database** | MongoDB + Mongoose | Document storage per service |
| **Message Broker** | Apache Kafka | Event-driven communication |
| **Authentication** | JWT + bcrypt | Secure user sessions |
| **Validation** | Joi | Request schema validation |
| **Logging** | Pino | High-performance JSON logs |
| **Rate Limiting** | express-rate-limit | DDoS protection |
| **Documentation** | Swagger/OpenAPI 3.0 | Interactive API docs |
| **Testing** | Jest + Supertest | Unit & integration tests |
| **Containerization** | Docker + Docker Compose | Deployment orchestration |
| **CI/CD** | GitHub Actions | Automated testing pipeline |

---

## 🚀 Quick Start

### Prerequisites

- **Docker** & **Docker Compose** (recommended)
- **Node.js** 18+ (for local development)
- **MongoDB** 6.0+ (if running without Docker)
- **Apache Kafka** (if running without Docker)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/ecom-microservice-graphql.git
cd ecom-microservice-graphql

# Configure environment variables
cp .env.example .env
# Edit .env and set JWT_SECRET=your_secure_secret_here

# Start all services (MongoDB, Kafka, all microservices)
docker-compose up -d

# Wait 30 seconds for services to initialize
# Check health status
curl http://localhost:3001/health  # User service
curl http://localhost:3002/health  # Product service
curl http://localhost:3003/health  # Order service
```

**🎉 You're live!** Services are running at:

- **User Service**: <http://localhost:3001>
- **Product Service**: <http://localhost:3002>
- **Order Service**: <http://localhost:3003>
- **GraphQL Gateway**: <http://localhost:4000/graphql>

### Option 2: Local Development

<details>
<summary>Click to expand local setup instructions</summary>

```bash
# Install dependencies for all services
npm install
cd user-service && npm install && cd ..
cd product-service && npm install && cd ..
cd order-service && npm install && cd ..
cd graphql-gateway && npm install && cd ..

# Start MongoDB and Kafka locally (or use Docker for just these)
docker-compose up -d mongodb kafka zookeeper

# Configure environment variables for each service
# Create .env files in each service directory (see examples below)

# Start services in separate terminals
cd user-service && npm start
cd product-service && npm start
cd order-service && npm start
cd graphql-gateway && npm start
```

</details>

### Environment Configuration

Create a `.env` file in the project root:

```env
# JWT Secret (REQUIRED - use a strong random string in production)
JWT_SECRET=your_super_secure_random_secret_key_here
```

Each service also has a `.env.example` file. Copy and customize as needed:

```bash
# User Service (.env in user-service/)
MONGO_URI=mongodb://mongodb:27017/user-service
PORT=3001
JWT_SECRET=${JWT_SECRET}
KAFKA_BROKER=kafka:29092

# Product Service (.env in product-service/)
MONGO_URI=mongodb://mongodb:27017/product-service
PORT=3002
JWT_SECRET=${JWT_SECRET}
KAFKA_BROKER=kafka:29092

# Order Service (.env in order-service/)
MONGO_URI=mongodb://mongodb:27017/order-service
PORT=3003
JWT_SECRET=${JWT_SECRET}
KAFKA_BROKER=kafka:29092
USER_SERVICE_URL=http://user-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002

# GraphQL Gateway (.env in graphql-gateway/)
PORT=4000
KAFKA_BROKER=kafka:29092
USER_SERVICE_URL=http://user-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002
ORDER_SERVICE_URL=http://order-service:3003
```

---

## 📖 API Documentation

### Interactive Documentation

Each service provides **Swagger UI** for testing endpoints directly in your browser:

- **User Service**: <http://localhost:3001/api-docs>
- **Product Service**: <http://localhost:3002/api-docs>
- **Order Service**: <http://localhost:3003/api-docs>
- **GraphQL Playground**: <http://localhost:4000/graphql>

### Quick Start Guide

#### 1. Register a User

```bash
curl -X POST http://localhost:3001/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

**Response:**

```json
{
  "message": "User registered successfully",
  "userId": "6a8db2c05cc0dc0462e81d76"
}
```

#### 2. Login to Get JWT Token

```bash
curl -X POST http://localhost:3001/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

**Response:**

```json
{
  "message": "Login successful",
  "userId": "6a8db2c05cc0dc0462e81d76",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 💡 **Copy the token** - you'll need it for authenticated requests!

#### 3. Use Swagger UI with Authentication

1. Go to any service's Swagger page (e.g., <http://localhost:3002/api-docs>)
2. Click the **🔓 Authorize** button (top-right)
3. Paste your token (just the token, no "Bearer " prefix)
4. Click **Authorize** → **Close**
5. All protected endpoints now work! 🎉

#### 4. Create a Product (Authenticated)

```bash
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone with A17 chip",
    "price": 999.99
  }'
```

#### 5. Create an Order (Authenticated)

```bash
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": "6a8db30473fa2b1553e0e171",
    "userId": "6a8db2c05cc0dc0462e81d76",
    "quantity": 2
  }'
```

### REST API Endpoints

<details>
<summary><b>User Service (Port 3001)</b></summary>

| Method | Endpoint | Auth | Description |
| -------- | ---------- | ------ | ------------- |
| `POST` | `/users/register` | ❌ | Register new user |
| `POST` | `/users/login` | ❌ | Login and get JWT token |
| `GET` | `/users` | ✅ | Get all users (paginated) |
| `GET` | `/users/:id` | ✅ | Get user by ID |
| `GET` | `/health` | ❌ | Health check endpoint |
| `GET` | `/api-docs` | ❌ | Swagger UI documentation |

**Rate Limits:**

- Login/Register: 10 requests per 15 minutes
- Other endpoints: 100 requests per 15 minutes

</details>

<details>
<summary><b>Product Service (Port 3002)</b></summary>

| Method | Endpoint | Auth | Description |
| -------- | ---------- | ------ | ------------- |
| `GET` | `/products` | ✅ | Get all products (paginated) |
| `GET` | `/products/:id` | ✅ | Get product by ID |
| `POST` | `/products` | ✅ | Create new product |
| `PUT` | `/products/:id` | ✅ | Update product |
| `DELETE` | `/products/:id` | ✅ | Delete product |
| `GET` | `/health` | ❌ | Health check endpoint |
| `GET` | `/api-docs` | ❌ | Swagger UI documentation |

**Pagination:**

- Query params: `?limit=20&offset=0`
- Max limit: 100 items per request
- Response includes: `{ data: [...], total, limit, offset }`

</details>

<details>
<summary><b>Order Service (Port 3003)</b></summary>

| Method | Endpoint | Auth | Description |
| -------- | ---------- | ------ | ------------- |
| `GET` | `/orders` | ✅ | Get all orders (paginated) |
| `GET` | `/orders/:id` | ✅ | Get order by ID |
| `POST` | `/orders` | ✅ | Create new order |
| `GET` | `/health` | ❌ | Health check endpoint |
| `GET` | `/api-docs` | ❌ | Swagger UI documentation |

**Cross-Service Validation:**

- Validates `productId` exists in Product Service
- Validates `userId` exists in User Service
- Returns 400 if validation fails
- Returns 503 if downstream service unavailable

</details>

### GraphQL Gateway (Port 4000)

Visit <http://localhost:4000/graphql> for the interactive GraphQL Playground.

<details>
<summary><b>Example Queries & Mutations</b></summary>

**Register User:**

```graphql
mutation {
  registerUser(
    username: "alice"
    email: "alice@example.com"
    password: "pass123"
  ) {
    message
    userId
  }
}
```

**Login:**

```graphql
mutation {
  loginUser(
    email: "alice@example.com"
    password: "pass123"
  ) {
    message
    userId
    token
  }
}
```

**Create Product (add token in HTTP headers):**

```graphql
mutation {
  createProduct(
    name: "MacBook Pro"
    description: "14-inch M3 Pro"
    price: 1999.99
  ) {
    _id
    name
    price
  }
}
```

**HTTP Headers:**

```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Query Products with Pagination:**

```graphql
query {
  products(limit: 10, offset: 0) {
    data {
      _id
      name
      description
      price
    }
    total
    limit
    offset
  }
}
```

**Create Order:**

```graphql
mutation {
  createOrder(
    productId: "6a8db30473fa2b1553e0e171"
    userId: "6a8db2c05cc0dc0462e81d76"
    quantity: 2
  ) {
    _id
    status
    quantity
  }
}
```

</details>

---

```bash
ecom-microservice-graphql/
├── user-service/              # User management microservice
│   ├── src/
│   │   ├── controllers/
│   │   │   └── userController.js      # Handles incoming requests for users
│   │   ├── models/
│   │   │   └── userModel.js           # User schema and Mongoose model
│   │   ├── routes/
│   │   │   └── userRoutes.js          # Routes for user-related actions
│   │   ├── services/
│   │   │   └── userService.js         # Business logic for users
│   │   ├── events/
│   │   │   ├── userProducer.js        # Produces Kafka events for user actions
│   │   │   └── userConsumer.js        # Consumes Kafka events related to users
│   │   └── app.js                     # Main entry point (Express setup)
│   ├── tests/
│   │   └── user.test.js               # Unit and integration tests for user-service
│   ├── Dockerfile                     # Dockerfile for user-service
│   ├── package.json                   # Package dependencies
│   └── .env.example                   # Example environment variables
│
├── product-service/           # Product management microservice
│   ├── src/
│   │   ├── controllers/
│   │   │   └── productController.js   # Handles product-related requests
│   │   ├── models/
│   │   │   └── productModel.js        # Product schema and Mongoose model
│   │   ├── routes/
│   │   │   └── productRoutes.js       # Routes for product-related actions
│   │   ├── services/
│   │   │   └── productService.js      # Business logic for products
│   │   ├── events/
│   │   │   ├── productProducer.js     # Produces Kafka events for products
│   │   │   └── productConsumer.js     # Consumes Kafka events related to products
│   │   └── app.js                     # Main entry point (Express setup)
│   ├── tests/
│   │   └── product.test.js            # Unit and integration tests for product-service
│   ├── Dockerfile                     # Dockerfile for product-service
│   ├── package.json                   # Package dependencies
│   └── .env.example                   # Example environment variables
│
├── order-service/             # Order management microservice
│   ├── src/
│   │   ├── controllers/
│   │   │   └── orderController.js     # Handles order-related requests
│   │   ├── models/
│   │   │   └── orderModel.js          # Order schema and Mongoose model
│   │   ├── routes/
│   │   │   └── orderRoutes.js         # Routes for order-related actions
│   │   ├── services/
│   │   │   └── orderService.js        # Business logic for orders
│   │   ├── events/
│   │   │   ├── orderProducer.js       # Produces Kafka events for orders
│   │   │   └── orderConsumer.js       # Consumes Kafka events related to orders
│   │   └── app.js                     # Main entry point (Express setup)
│   ├── tests/
│   │   └── order.test.js              # Unit and integration tests for order-service
│   ├── Dockerfile                     # Dockerfile for order-service
│   ├── package.json                   # Package dependencies
│   └── .env.example                   # Example environment variables
│
├── graphql-gateway/           # GraphQL API Gateway
│   ├── src/
│   │   ├── schemas/
│   │   │   └── index.js               # GraphQL schemas for user, product, and order
│   │   ├── resolvers/
│   │   │   └── index.js               # GraphQL resolvers
│   │   └── server.js                  # Apollo Server setup for GraphQL
│   ├── tests/
│   │   └── graphql.test.js            # Unit and integration tests for GraphQL API
│   ├── Dockerfile                     # Dockerfile for GraphQL API Gateway
│   ├── package.json                   # Package dependencies
│   └── .env.example                   # Example environment variables
│
├── kafka/                     # Kafka setup and configurations
│   ├── topics/
│   │   └── topicConfig.json           # Kafka topics configuration (user, product, order events)
│   └── consumers/
│       ├── userConsumer.js            # Kafka consumer for user-related events
│       ├── productConsumer.js         # Kafka consumer for product-related events
│       └── orderConsumer.js           # Kafka consumer for order-related events
│
├── docker-compose.yml         # Main Docker Compose for all services (microservices, GraphQL, Kafka, MongoDB)
├── package.json               # Package dependencies for the root directory
├── package-lock.json          # Package lock for the root directory
├── README.md                  # Documentation for the entire project
└── .env.example               # Main environment variables example for the root project



## 🧪 Testing

### Running Tests

```bash
# Run all tests across all services
npm test

# Run tests for specific service
cd user-service && npm test
cd product-service && npm test
cd order-service && npm test
cd graphql-gateway && npm test
```

### Continuous Integration

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically:

✅ Installs dependencies for all services  
✅ Runs linters (if configured)  
✅ Executes test suites  
✅ Fails the build on any errors  

**Workflow triggers on:**

- Push to `main` branch
- Pull requests targeting `main`

### Manual Testing with Postman

1. Import the Postman collection (if provided)
2. Set environment variables:
   - `baseUrl`: `http://localhost:3001`
   - `token`: Your JWT token from login
3. Test workflows:
   - User registration → Login → Create product → Create order

---

## 📁 Project Structure

```bash
ecom-microservice-graphql/
├── .github/
│   └── workflows/
│       └── ci.yml                     # CI/CD pipeline configuration
│
├── user-service/                      # User management microservice
│   ├── src/
│   │   ├── controllers/
│   │   │   └── userController.js      # Request handlers
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT validation
│   │   │   ├── errorHandler.js        # Centralized error handling
│   │   │   └── validate.js            # Joi validation middleware
│   │   ├── models/
│   │   │   └── userModel.js           # Mongoose schema
│   │   ├── routes/
│   │   │   └── userRoutes.js          # Express routes with Swagger docs
│   │   ├── services/
│   │   │   └── userService.js         # Business logic layer
│   │   ├── events/
│   │   │   ├── userProducer.js        # Kafka event publisher
│   │   │   └── userConsumer.js        # Kafka event subscriber
│   │   ├── logger.js                  # Pino structured logger
│   │   ├── swagger.js                 # OpenAPI configuration
│   │   └── app.js                     # Express server setup
│   ├── tests/
│   │   └── user.test.js               # Jest + Supertest tests
│   ├── Dockerfile                     # Container definition
│   ├── package.json                   # Dependencies
│   └── .env.example                   # Environment template
│
├── product-service/                   # Product catalog microservice
│   ├── src/                           # (Same structure as user-service)
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── events/
│   │   ├── logger.js
│   │   ├── swagger.js
│   │   └── app.js
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── order-service/                     # Order processing microservice
│   ├── src/                           # (Same structure + cross-service validation)
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── orderService.js        # Validates with User & Product services
│   │   ├── events/
│   │   ├── logger.js
│   │   ├── swagger.js
│   │   └── app.js
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── graphql-gateway/                   # Unified GraphQL API
│   ├── src/
│   │   ├── schemas/
│   │   │   └── index.js               # Type definitions for all entities
│   │   ├── resolvers/
│   │   │   └── index.js               # Query/Mutation resolvers
│   │   ├── logger.js                  # Pino logger
│   │   └── server.js                  # Apollo Server setup
│   ├── tests/
│   │   └── graphql.test.js
│   ├── Dockerfile
│   └── package.json
│
├── kafka/                             # Kafka configurations
│   ├── topics/
│   │   └── topicConfig.json           # Topic definitions
│   └── consumers/
│       ├── userConsumer.js            # Standalone user event processor
│       ├── productConsumer.js         # Standalone product event processor
│       └── orderConsumer.js           # Standalone order event processor
│
├── docker-compose.yml                 # Multi-container orchestration
├── .env                               # Environment variables (gitignored)
├── .env.example                       # Environment template
├── package.json                       # Root dependencies
└── README.md                          # This file
```

---

## 🔧 Advanced Configuration

### Scaling Services

Scale individual services based on load:

```bash
# Scale product service to 3 instances
docker-compose up -d --scale product-service=3

# Scale order service to 2 instances
docker-compose up -d --scale order-service=2
```

### Rate Limiting Customization

Edit rate limits in each service's `app.js`:

```javascript
// Global rate limit (current: 100 req/15min)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,  // Adjust this value
  message: { error: 'Too many requests', status: 429 }
}));

// Auth-specific rate limit (current: 10 req/15min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // Adjust this value
  message: { error: 'Too many authentication attempts', status: 429 }
});
```

### Database Indexing

For production, add indexes to MongoDB collections:

```javascript
// In each model file, add:
schema.index({ email: 1 });          // User lookups
schema.index({ createdAt: -1 });     // Sorting by date
schema.index({ userId: 1, status: 1 }); // Compound index for orders
```

### Logging Levels

Adjust log verbosity in each service's `logger.js`:

```javascript
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',  // debug, info, warn, error
  // ...
});
```

---

## 🐛 Troubleshooting

### Services won't start

```bash
# Check container logs
docker-compose logs user-service
docker-compose logs product-service
docker-compose logs order-service

# Restart all services
docker-compose restart

# Rebuild containers after code changes
docker-compose up -d --build
```

### Database connection errors

```bash
# Verify MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
docker logs mongodb

# Connect to MongoDB shell
docker exec -it mongodb mongosh
```

### Kafka event errors

```bash
# Check Kafka logs
docker logs kafka

# Verify topics exist
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092

# Create missing topics
docker exec -it kafka kafka-topics --create \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1
```

### Authentication issues

- **"Access denied. No token provided"**: Add `Authorization: Bearer <token>` header
- **"Invalid or expired token"**: Login again to get a fresh token (valid for 1 hour)
- **Token format**: Ensure you copy the entire token (200+ characters)

### Rate limiting hit

```bash
# Wait 15 minutes, or restart the affected service
docker-compose restart user-service
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure CI pipeline passes before submitting PR
- Keep commits atomic and messages descriptive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kushagra Pratap Singh**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Built with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- GraphQL powered by [Apollo Server](https://www.apollographql.com/)
- Event streaming with [Apache Kafka](https://kafka.apache.org/)
- Database by [MongoDB](https://www.mongodb.com/)
- Containerization with [Docker](https://www.docker.com/)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/ecom-microservice-graphql?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ecom-microservice-graphql?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ecom-microservice-graphql)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ecom-microservice-graphql)

---

<div align="center">
  
### ⭐ If you find this project useful, please consider giving it a star

**Built with ❤️ for the developer community**

</div>
