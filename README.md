<div align="center">

# 🛒 E-Commerce Microservices Platform

**Production-ready microservices with GraphQL gateway, Kafka event streaming, role-based access control, and CI/CD.**

[![CI](https://github.com/kushagra0526/ecom_microservice_graphql/actions/workflows/ci.yml/badge.svg)](https://github.com/kushagra0526/ecom_microservice_graphql/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Kafka](https://img.shields.io/badge/Kafka-KafkaJS-black.svg)](https://kafka.js.org/)

</div>

---

## Overview

A scalable e-commerce backend built with independent microservices. Each service owns its database, communicates asynchronously via Kafka, and exposes a REST API — unified through a single GraphQL gateway.

---

## Architecture

```
┌────────────────────────────────────────────────────┐
│                    Clients                         │
└───────────────────────┬────────────────────────────┘
                        │
              ┌─────────▼──────────┐
              │   GraphQL Gateway  │  :4000
              └──┬──────┬──────┬───┘
                 │      │      │
         ┌───────▼┐  ┌──▼────┐ ┌▼──────────┐
         │  User  │  │Product│ │   Order   │
         │Service │  │Service│ │  Service  │
         │  :3001 │  │ :3002 │ │   :3003   │
         └───┬────┘  └──┬────┘ └────┬──────┘
             │          │           │
             └──────────┼───────────┘
                        │
              ┌─────────▼──────────┐
              │    Apache Kafka    │
              └──────────┬─────────┘
                         │
              ┌──────────▼─────────┐
              │      MongoDB       │
              │ (per-service DB)   │
              └────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
| ------- | ----------- |
| Runtime | Node.js 18 + Express |
| Gateway | Apollo Server (GraphQL) |
| Database | MongoDB + Mongoose |
| Events | Apache Kafka (KafkaJS) |
| Auth | JWT + bcrypt |
| Validation | Joi |
| Logging | Pino (structured JSON) |
| Rate Limiting | express-rate-limit |
| API Docs | Swagger / OpenAPI 3.0 |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |
| Containers | Docker + Docker Compose |

---

## Features

- **3 Roles** — `buyer`, `seller`, `admin` with role-based access control
- **JWT Auth** — role embedded in token, stateless RBAC across services
- **Kafka Events** — async pub/sub between services (KafkaJS, Upstash-ready)
- **GraphQL Gateway** — unified API for all 3 services
- **Pagination** — `?limit` & `?offset` on all list endpoints
- **Joi Validation** — schema validation on every write endpoint
- **Health Checks** — `GET /health` on every service
- **Swagger Docs** — `GET /api-docs` on every service
- **Pino Logging** — structured JSON logs, auth tokens redacted
- **Rate Limiting** — 100 req/15min global, 10 req/15min on auth routes
- **CI Pipeline** — GitHub Actions runs all tests on every push

---

## Role Permissions

| Action | buyer | seller | admin |
| -------- | ------- | -------- | ------- |
| Register / Login | ✅ | ✅ | ✅ |
| Browse products | ✅ | ✅ | ✅ |
| Create / Edit / Delete product | ❌ | ✅ | ✅ |
| Place an order | ✅ | ❌ | ❌ |
| View all orders | ❌ | ❌ | ✅ |
| Update order status | ❌ | ❌ | ✅ |

> `admin` cannot be self-assigned on register — set it directly in MongoDB.

---

## Live Demo

| Service | URL |
| --------- | ----- |
| User Service | <https://user-service-c8im.onrender.com> |
| Product Service | <https://product-service-kh6b.onrender.com> |
| Order Service | <https://order-service-ygr5.onrender.com> |
| GraphQL Gateway | <https://graphql-gateway-dr2p.onrender.com/graphql> |

> Free tier — services sleep after 15 min of inactivity. Hit `/health` on each to wake them up before testing.

**Swagger Docs:**

- <https://user-service-c8im.onrender.com/api-docs>
- <https://product-service-kh6b.onrender.com/api-docs>
- <https://order-service-ygr5.onrender.com/api-docs>

---

### Prerequisites

- Docker + Docker Compose

### Run locally

```bash
git clone https://github.com/kushagra0526/ecom_microservice_graphql.git
cd ecom_microservice_graphql

# Set your JWT secret
echo "JWT_SECRET=your_secret_here" > .env

# Start everything
docker-compose up -d
```

Wait ~20 seconds for Kafka to initialize, then check:

```bash
curl http://localhost:3001/health   # user-service
curl http://localhost:3002/health   # product-service
curl http://localhost:3003/health   # order-service
```

---

## API Reference

### Swagger UI (interactive docs)

| Service | URL |
| --------- | ----- |
| User | <http://localhost:3001/api-docs> |
| Product | <http://localhost:3002/api-docs> |
| Order | <http://localhost:3003/api-docs> |
| GraphQL | <http://localhost:4000/graphql> |

---

### Authentication Flow

**1. Register**

```bash
POST http://localhost:3001/users/register
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "pass123",
  "role": "seller"          # buyer (default) | seller
}
```

**2. Login**

```bash
POST http://localhost:3001/users/login
{
  "email": "alice@example.com",
  "password": "pass123"
}
# Returns: { "token": "eyJ...", "role": "seller", "userId": "..." }
```

**3. Use the token**

```
Authorization: Bearer eyJ...
```

---

### REST Endpoints

**User Service** — `http://localhost:3001`

| Method | Route | Auth | Role |
| -------- | ------- | ------ | ------ |
| POST | `/users/register` | ❌ | — |
| POST | `/users/login` | ❌ | — |
| GET | `/users` | ✅ | any |
| GET | `/users/:id` | ✅ | any |
| GET | `/health` | ❌ | — |

**Product Service** — `http://localhost:3002`

| Method | Route | Auth | Role |
| -------- | ------- | ------ | ------ |
| GET | `/products` | ❌ | — |
| GET | `/products/:id` | ❌ | — |
| POST | `/products` | ✅ | seller, admin |
| PUT | `/products/:id` | ✅ | seller, admin |
| DELETE | `/products/:id` | ✅ | seller, admin |
| GET | `/health` | ❌ | — |

**Order Service** — `http://localhost:3003`

| Method | Route | Auth | Role |
| -------- | ------- | ------ | ------ |
| POST | `/orders` | ✅ | buyer |
| GET | `/orders` | ✅ | admin |
| GET | `/orders/:id` | ✅ | admin |
| PATCH | `/orders/:id/status` | ✅ | admin |
| GET | `/health` | ❌ | — |

**Status values:** `Pending` → `Completed` or `Cancelled`

---

### GraphQL Examples

```graphql
# Login
mutation {
  loginUser(email: "alice@example.com", password: "pass123") {
    token
    role
  }
}

# Browse products (paginated)
query {
  getProducts(limit: 10, offset: 0) {
    data { _id name price }
    total
  }
}

# Create product (seller token in HTTP headers)
mutation {
  createProduct(name: "MacBook Pro", description: "M3 chip", price: 1999.99) {
    _id name price
  }
}

# Place order (buyer token)
mutation {
  createOrder(productId: "...", userId: "...", quantity: 2) {
    _id status
  }
}
```

Add token in GraphQL headers:

```json
{ "Authorization": "Bearer eyJ..." }
```

---

## Kafka Events

Each service publishes and consumes events on its own topic:

| Topic | Producer | Event |
| ------- | ---------- | ------- |
| `user-events` | user-service | `UserRegistered` |
| `product-events` | product-service | `ProductCreated` |
| `order-events` | order-service | Order data |

**Works with:**

- Local Docker Kafka — just set `KAFKA_BROKER=kafka:29092`
- Upstash Kafka — add `KAFKA_USERNAME` + `KAFKA_PASSWORD` and SSL kicks in automatically

---

## Environment Variables

**Root `.env`**

```env
JWT_SECRET=your_strong_secret
```

**order-service** (extra vars)

```env
USER_SERVICE_URL=http://user-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002
```

**All services**

```env
MONGO_URI=mongodb://mongodb:27017/<service-name>
PORT=3001                      # 3001 / 3002 / 3003 / 4000
JWT_SECRET=your_strong_secret
KAFKA_BROKER=kafka:29092

# Upstash Kafka (cloud deployment)
# KAFKA_USERNAME=...
# KAFKA_PASSWORD=...
```

---

## Running Tests

```bash
cd user-service    && npm test
cd product-service && npm test
cd order-service   && npm test
cd graphql-gateway && npm test
```

CI runs automatically on every push and pull request to `main`.

---

## Deployment (Render + MongoDB Atlas + Upstash)

1. **MongoDB Atlas** — create 3 free databases (`user-service`, `product-service`, `order-service`)
2. **Upstash Kafka** — create a cluster, add topics `user-events`, `product-events`, `order-events`
3. **Render** — deploy 4 Web Services, one per directory, with environment variables set:

| Service | Root Dir | Start Command |
| --------- | ---------- | --------------- |
| user-service | `user-service` | `node src/app.js` |
| product-service | `product-service` | `node src/app.js` |
| order-service | `order-service` | `node src/app.js` |
| graphql-gateway | `graphql-gateway` | `node src/server.js` |

Deploy `user-service` and `product-service` first, then set their Render URLs as env vars in `order-service` and `graphql-gateway`.

---

## Project Structure

```
├── user-service/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── events/         # Kafka producer + consumer
│   │   ├── middleware/      # auth, validate, errorHandler, role
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes + Swagger annotations
│   │   ├── services/       # Business logic
│   │   ├── app.js          # Express setup
│   │   ├── logger.js       # Pino logger
│   │   └── swagger.js      # OpenAPI config
│   └── tests/
│
├── product-service/        # same structure
├── order-service/          # same structure + roleMiddleware
├── graphql-gateway/
│   └── src/
│       ├── schemas/        # GraphQL type definitions
│       ├── resolvers/      # Query + Mutation resolvers
│       └── server.js       # Apollo Server
│
├── .github/workflows/ci.yml
├── docker-compose.yml
└── README.md
```

---

## Author

**Kushagra Pratap Singh**

---

<div align="center">

⭐ If this helped you, consider starring the repo!

</div>
