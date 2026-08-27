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

A scalable e-commerce backend built with independent microservices. Each service owns its database, communicates asynchronously via Kafka, and exposes a REST API — unified through a single GraphQL gateway. Includes a Next.js storefront built against the real APIs.

---

## Architecture

```
┌────────────────────────────────────────────────────┐
│              Voltline Frontend (Next.js)            │
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
             └──────────┼───────────┘
                        │
              ┌─────────▼──────────┐
              │    Apache Kafka    │
              └──────────┬─────────┘
                         │
              ┌──────────▼─────────┐
              │  MongoDB (per-svc) │
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
| Frontend | Next.js 14 + React 18 (JavaScript) |

---

## Features

- **3 Roles** — `buyer`, `seller`, `admin` with server-side RBAC
- **JWT Auth** — role embedded in token, stateless across all services
- **Kafka Events** — async pub/sub (KafkaJS, works with local Docker or Aiven)
- **GraphQL Gateway** — unified API for all 3 services
- **Pagination** — `?limit` & `?offset` on all list endpoints
- **Joi Validation** — schema validation on every write endpoint
- **Health Checks** — `GET /health` on every service
- **Swagger Docs** — `GET /api-docs` on every service
- **Pino Logging** — structured JSON logs, tokens redacted
- **Rate Limiting** — 100 req/15min global, 10 req/15min on auth routes
- **CI Pipeline** — GitHub Actions, all 4 services tested on every push

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

> `admin` cannot be self-assigned — set it directly in MongoDB.

---

## Live Demo

| Service | URL |
| --------- | ----- |
| User Service | <https://user-service-c8im.onrender.com> |
| Product Service | <https://product-service-kh6b.onrender.com> |
| Order Service | <https://order-service-ygr5.onrender.com> |
| GraphQL Gateway | <https://graphql-gateway-dr2p.onrender.com/graphql> |

> Free tier — services sleep after 15 min of inactivity. Hit `/health` on each to wake them before testing.

**Swagger Docs:**

- <https://user-service-c8im.onrender.com/api-docs>
- <https://product-service-kh6b.onrender.com/api-docs>
- <https://order-service-ygr5.onrender.com/api-docs>

---

## Frontend — Voltline

A **Next.js 14 + React 18** storefront for the e-commerce platform, written in plain JavaScript. Category: minimal everyday carry tech (cables, chargers, stands).

### Run locally

```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

### Environment variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_USER_SERVICE_URL=https://user-service-c8im.onrender.com
NEXT_PUBLIC_GRAPHQL_URL=https://graphql-gateway-dr2p.onrender.com/graphql
```

### Deploy on Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add the 2 env vars above
4. Deploy

### Screens

| Screen | Path | Auth |
| -------- | ------ | ------ |
| Catalog | `/` | No |
| Product detail | `/products/:id` | No |
| Cart | `/cart` | No |
| Checkout | `/checkout` | buyer |
| Register | `/auth/register` | No |
| Login | `/auth/login` | No |
| Seller dashboard | `/dashboard` | seller / admin |

### GraphQL coverage

| Operation | Used? | Notes |
| ----------- | ------- | ------- |
| `getProducts` | ✅ | Catalog, dashboard |
| `getProduct` | ✅ | Product detail |
| `createProduct` | ✅ | Seller dashboard |
| `updateProduct` | ✅ | Seller dashboard |
| `deleteProduct` | ✅ | Seller dashboard |
| `createOrder` | ✅ | Checkout |
| `getOrders` | ❌ | No admin orders UI |
| `getOrder` | ❌ | No per-order detail page |
| `getUsers` | ❌ | No admin user list |
| `getUser` | ❌ | No user profile page |
| `createUser` | ❌ | Registration uses REST — GraphQL mutation has no `role` arg |

### Intentional limitations

- **Role enforcement** — dashboard redirects buyers as UX. Real security is `roleMiddleware` on product-service — buyer token gets real 403 from API.
- **No per-owner restriction** — any seller can edit any product. Backend has no owner field.
- **Cart is client-side only** — localStorage, prices snapshotted at add-time.
- **No admin orders UI** — `getOrders`/`getOrder` require admin token, not built.

---

## Quick Start (Backend)

```bash
git clone https://github.com/kushagra0526/ecom_microservice_graphql.git
cd ecom_microservice_graphql

echo "JWT_SECRET=your_secret_here" > .env

docker-compose up -d
```

Check services are up:

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

---

## REST Endpoints

**User Service — :3001**

| Method | Route | Auth | Role |
| -------- | ------- | ------ | ------ |
| POST | `/users/register` | ❌ | — |
| POST | `/users/login` | ❌ | — |
| GET | `/users` | ✅ | any |
| GET | `/users/:id` | ✅ | any |
| GET | `/health` | ❌ | — |

**Product Service — :3002**

| Method | Route | Auth | Role |
| -------- | ------- | ------ | ------ |
| GET | `/products` | ❌ | — |
| GET | `/products/:id` | ❌ | — |
| POST | `/products` | ✅ | seller, admin |
| PUT | `/products/:id` | ✅ | seller, admin |
| DELETE | `/products/:id` | ✅ | seller, admin |
| GET | `/health` | ❌ | — |

**Order Service — :3003**

| Method | Route | Auth | Role |
| -------- | ------- | ------ | ------ |
| POST | `/orders` | ✅ | buyer |
| GET | `/orders` | ✅ | admin |
| GET | `/orders/:id` | ✅ | admin |
| PATCH | `/orders/:id/status` | ✅ | admin |
| GET | `/health` | ❌ | — |

---

## Authentication

```bash
# Register
POST /users/register
{ "username": "alice", "email": "alice@example.com", "password": "pass123", "role": "seller" }

# Login — returns token
POST /users/login
{ "email": "alice@example.com", "password": "pass123" }

# Use token on protected routes
Authorization: Bearer eyJ...
```

---

## Kafka Events

| Topic | Producer | Event |
| ------- | ---------- | ------- |
| `user-events` | user-service | `UserRegistered` |
| `product-events` | product-service | `ProductCreated` |
| `order-events` | order-service | Order data |

Works with local Docker Kafka (`KAFKA_BROKER=kafka:29092`) or Aiven cloud Kafka (add `KAFKA_USERNAME` + `KAFKA_PASSWORD`).

---

## Running Tests

```bash
cd user-service    && npm test
cd product-service && npm test
cd order-service   && npm test
cd graphql-gateway && npm test
```

CI runs on every push and PR to `main`.

---

## Environment Variables

**Root `.env`**

```env
JWT_SECRET=your_strong_secret
```

**Each service** also needs `MONGO_URI`, `PORT`, `JWT_SECRET`, `KAFKA_BROKER`.  
**order-service** additionally needs `USER_SERVICE_URL` and `PRODUCT_SERVICE_URL`.

---

## Deployment

### Backend (Render + MongoDB Atlas + Aiven Kafka)

| Service | Root Dir | Start Command |
| --------- | ---------- | --------------- |
| user-service | `user-service` | `node src/app.js` |
| product-service | `product-service` | `node src/app.js` |
| order-service | `order-service` | `node src/app.js` |
| graphql-gateway | `graphql-gateway` | `node src/server.js` |

Deploy user-service and product-service first, then set their URLs as env vars in order-service and graphql-gateway.

### Frontend (Vercel)

Root Directory: `frontend` — add env vars and deploy.

---

## Project Structure

```
├── user-service/
├── product-service/
├── order-service/
├── graphql-gateway/
├── frontend/              # Next.js 14 storefront (JavaScript)
│   ├── app/
│   │   ├── components/    # Nav, ProductCard, ProductCardSkeleton
│   │   ├── context/       # AuthContext, CartContext
│   │   ├── lib/           # gql.js (GraphQL client)
│   │   ├── auth/          # login, register pages
│   │   ├── cart/          # cart page
│   │   ├── checkout/      # checkout + order confirmation
│   │   ├── dashboard/     # seller product CRUD
│   │   └── products/      # product detail page
│   └── scripts/
│       └── seed.mjs       # seeds 12 sample products
├── .github/workflows/ci.yml
├── docker-compose.yml
└── README.md
```

---

## Author

**Kushagra Pratap Singh**

---

<div align="center">
⭐ Star the repo if this helped!
</div>
