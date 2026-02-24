# Launchpad

A production RESTful API backend, built with modern backend engineering principles. This project demonstrates industry-standard practices for building scalable, observable, and maintainable backend services.

## Overview

- **RESTful API** with proper HTTP semantics
- **Authentication & Authorization** using JWT
- **Database Management** with Prisma ORM
- **Caching** with Redis for performance optimization
- **Rate Limiting** to prevent abuse
- **Comprehensive Testing** (Unit + Integration)
- **Observability** with OpenTelemetry, Prometheus, and Grafana
- **Containerization** with Docker
- **Orchestration** with Kubernetes
- **CI/CD** pipelines for automated testing and deployment
- **Health Checks** for reliability monitoring

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│                    (Web/Mobile/API Clients)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Ingress                    │
│              (Kubernetes Ingress / Load Balancer)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Express    │  │  Middlewares │  │  Controllers │       │
│  │   Server     │  │  (Auth,      │  │  (Business   │       │
│  │              │  │   RateLimit, │  │   Logic)     │       │
│  │              │  │   Validation) │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│                           ▼                                 │
│                  ┌─────────────────┐                        │
│                  │   Service Layer  │                       │
│                  │  (Data Access,   │                       │
│                  │   Business Logic)│                       │
│                  └─────────┬─────────┘                      │
└───────────────────────────┼─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  PostgreSQL   │  │  Redis Cache  │  │  Observability│
│   Database    │  │   (Upstash)   │  │  (Prometheus, │
│               │  │                │  │   Grafana,    │
│               │  │                │  │   OpenTelemetry)│
└───────────────┘  └───────────────┘  └───────────────┘
```

## Getting Started

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
DIRECT_URL=postgresql://user:password@localhost:5432/todo_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-32-characters-long
JWT_EXPIRES_IN=1h

# Redis (Upstash)
UPSTASH_REDIS_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token

# OpenTelemetry (optional)
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
OTEL_SERVICE_NAME=todo-backend

# Test Environment
TEST_USER_ID=test-user-id-for-testing

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd production-ready-backend-template
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

4. **Start the development server**

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Check code formatting
npm run format:fix   # Fix code formatting
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Docker Deployment

### Build Image

```bash
docker build -f docker/Dockerfile -t todo-backend:latest .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret \
  todo-backend:latest
```

### Docker Compose

```bash
# Start application with dependencies
docker-compose -f docker/docker-compose.yaml up -d

# View logs
docker-compose -f docker/docker-compose.yaml logs -f backend

# Stop services
docker-compose -f docker/docker-compose.yaml down
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- PostgreSQL and Redis accessible from cluster

### Deploy

1. **Create namespace**

```bash
kubectl create namespace todo-backend
```

2. **Create secrets**

```bash
kubectl create secret generic todo-backend-secrets \
  --from-literal=DATABASE_URL=postgresql://... \
  --from-literal=JWT_SECRET=... \
  --from-literal=UPSTASH_REDIS_URL=... \
  --from-literal=UPSTASH_REDIS_TOKEN=... \
  -n todo-backend
```

3. **Apply configurations**

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n todo-backend

# Check services
kubectl get svc -n todo-backend

# Check ingress
kubectl get ingress -n todo-backend

# View logs
kubectl logs -f deployment/todo-backend -n todo-backend
```

## API Documentation

### Base URL

```
Development: http://localhost:3000
Production: https://api.example.com
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

##### Register User

```http
POST /api/v1/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (409 Conflict)**

```json
{
  "success": false,
  "message": "The email is already taken."
}
```

##### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### Todos

##### Create Todo

```http
POST /api/v1/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "completed": false
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "uuid",
    "title": "Complete project documentation",
    "completed": false,
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

##### Get Todos (Paginated)

```http
GET /api/v1/todos?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Todos retrieved successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Complete project documentation",
        "completed": false,
        "userId": "user-uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "totalItems": 25,
      "totalPages": 3,
      "currentPage": 1,
      "itemsPerPage": 10
    }
  }
}
```

##### Update Todo

```http
PATCH /api/v1/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated title",
    "completed": true,
    "userId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

##### Delete Todo

```http
DELETE /api/v1/todos/:id
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

#### Health Checks

##### Database Health Check

```http
GET /health/database
```

**Response (200 OK)**

```json
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "Connected",
    "redis": "Connected"
  }
}
```

**Response (503 Service Unavailable)**

```json
{
  "status": "unhealthy",
  "message": "Service unavailable",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "Disconnected",
    "redis": "Unknown"
  }
}
```

### Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "status": "fail" | "error",
  "message": "Error message description"
}
```

**Status Codes:**

- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Authorization failed)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Duplicate resource)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

### Rate Limiting

Rate limits are applied per IP address and per authenticated user:

- **Limit**: 30 requests per 60 seconds (sliding window)
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

### Horizontal Pod Autoscaling

The HPA automatically scales pods based on CPU utilization:

- **Min replicas**: 2
- **Max replicas**: 4
- **Target CPU**: 50%

## Observability

### Metrics

Prometheus metrics are exposed at `/metrics`:

- HTTP request duration
- HTTP request count
- Error rates
- System metrics (CPU, memory, etc.)

### Logging

Structured logging with Winston:

- **Console**: Development logs
- **File**: Production logs (`logs/all.log`, `logs/error.log`)
- **Format**: JSON in production, colored in development

### Tracing

OpenTelemetry distributed tracing:

- Automatic instrumentation
- HTTP request tracing
- Database query tracing
- Custom spans for business logic

### Grafana Dashboards

Access Grafana at `http://localhost:3001` (when using `docker/docker-compose.observability.yml`)

**Key Metrics:**

- Request rate
- Error rate
- Response time (p50, p95, p99)
- Database connection pool
- Cache hit rate

**Note**: This is a learning project demonstrating production-ready backend practices. For production use, ensure all security measures are properly configured and secrets are managed securely.
