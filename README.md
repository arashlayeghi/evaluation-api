# Evaluation API

A REST API built with Node.js and Express featuring JWT authentication, CRUD operations, pagination, and role-based access control.

## Features

- User registration and login with JWT authentication
- CRUD operations for Evaluations
- Pagination on list endpoints
- Role-based access control (admin/user)
- Swagger/OpenAPI documentation
- Dockerized deployment

## Tech Stack

- Node.js / Express.js
- MongoDB with Mongoose
- JWT for authentication
- Swagger UI for API documentation
- Docker & Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Or: Node.js 18+ and MongoDB for local development

### Running with Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd evaluation-api

# Start the application
docker-compose up --build

# The API will be available at http://localhost:3000
# Swagger documentation at http://localhost:3000/api-docs
```

To stop the application:
```bash
docker-compose down
```

### Running Locally (without Docker)

```bash
# Install dependencies
npm install

# Set environment variables (or create .env file)
export MONGODB_URI=mongodb://localhost:27017/evaluations
export JWT_SECRET=your-secret-key
export PORT=3000

# Start MongoDB locally, then run:
npm run dev
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT token |
| GET | /api/auth/profile | Get current user profile |

### Evaluations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/evaluations | Create a new evaluation |
| GET | /api/evaluations | List all evaluations (paginated) |
| GET | /api/evaluations/:id | Get evaluation by ID |
| PUT | /api/evaluations/:id | Update an evaluation |
| DELETE | /api/evaluations/:id | Delete an evaluation |

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save the returned token for subsequent requests:
```bash
TOKEN="<your-jwt-token>"
```

### 3. Create an Evaluation

```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Q4 Review","description":"Quarterly performance review","score":85,"status":"completed"}'
```

### 4. List Evaluations (with Pagination)

```bash
curl "http://localhost:3000/api/evaluations?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Get Single Evaluation

```bash
curl "http://localhost:3000/api/evaluations/<evaluation-id>" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Update an Evaluation

```bash
curl -X PUT "http://localhost:3000/api/evaluations/<evaluation-id>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"score":92,"status":"completed"}'
```

### 7. Delete an Evaluation

```bash
curl -X DELETE "http://localhost:3000/api/evaluations/<evaluation-id>" \
  -H "Authorization: Bearer $TOKEN"
```

## Role Management

Users can be assigned one of two roles:

- **user** (default): Can only access their own evaluations
- **admin**: Can access all evaluations from all users

To register an admin user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123","name":"Admin User","role":"admin"}'
```

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

Use the "Authorize" button to enter your JWT token and test endpoints directly from the browser.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/evaluations |
| JWT_SECRET | Secret key for JWT signing | - |
| JWT_EXPIRES_IN | Token expiration time | 7d |

## Project Structure

```
evaluation-api/
├── src/
│   ├── config/
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── evaluationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Evaluation.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── evaluations.js
│   ├── swagger/
│   │   └── swagger.js
│   └── app.js
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```