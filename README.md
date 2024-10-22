
# Chat Room Application

A full-stack chat room application built with **Node.js**, **Express**, **MongoDB**, and **Vue.js**. It supports real-time communication using **Socket.IO** and provides a RESTful API for managing chat history. This project is designed for seamless real-time chat functionalities with scalable backend services, featuring user authentication, message persistence, and state management.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Using Docker](#using-docker)
- [Manual Setup](#manual-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [Backend](#backend)
  - [API Documentation](#api-documentation)
  - [Available Scripts](#available-scripts)
  - [Dependencies](#dependencies)
  - [Dev Dependencies](#dev-dependencies)
- [Frontend](#frontend)
  - [Project Setup](#project-setup)
  - [Available Scripts](#available-scripts-1)
  - [Dependencies](#dependencies-1)
  - [Dev Dependencies](#dev-dependencies-1)
- [Running Tests](#running-tests)
- [License](#license)

## Features

- **Real-time messaging** with Socket.IO
- **User authentication** via JWT
- **Chat history persistence** using MongoDB
- **Responsive frontend** built with Vue.js and Tailwind CSS
- **API documentation** with Swagger
- **Dockerized environment** for easy deployment

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (version 14.x or higher)
- **MongoDB** (version 4.x or higher)
- **Docker** (optional but recommended)

## Installation

### Environment Variables

Create a `.env` file in the `backend` and `frontend` directories and configure the following environment variables:

For **backend**:

```bash
PORT=5001
MONGO_URI=mongodb://root:root@mongodb:27017/admin
JWT_SECRET="d9D/nn9t2G4eX+V/a+9stGKKuWFapNpk8/WoJydDr+M="
JWT_EXPIRES_IN=24h
REDIS_URL=redis://default:root@redis:6379
UPLOADS_DIR=/public/uploads
UPLOADS_STATIC_DIR=/uploads
```

For **frontend**:

```bash
VUE_APP_BACKEND_URL=http://localhost:5001
VUE_APP_API_URL=http://localhost:5001/api
VUE_APP_SOCKET_URL=http://localhost:5001/socket
```

## Running the Application

### Using Docker (Recommended)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/chat-room.git
   cd chat-room
   ```

2. **Run the application using Docker**:

   ```bash
   docker-compose up --build
   ```

   This will start the frontend, backend, and MongoDB containers.

3. **Access the application**:

   - Frontend: Visit `http://localhost:8080`
   - Backend API: Visit `http://localhost:5001/api`

### Manual Setup

If you prefer to run the application without Docker, follow these steps:

#### Backend Setup

1. **Install MongoDB and Redis**:
   - Install [MongoDB](https://docs.mongodb.com/manual/installation/) and make sure it is running on the default port `27017`.
   - Install [Redis](https://redis.io/download) and ensure it is running on the default port `6379`.

2. **Install dependencies**:

   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server**:

   ```bash
   npm start
   ```

   This will run the backend on `http://localhost:5001`.

#### Frontend Setup

1. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend development server**:

   ```bash
   npm run serve
   ```

   This will run the frontend on `http://localhost:8080`.

## Project Structure

```bash
chat-room/
├── backend/
│   ├── config/               # Configs for database, redis and multer
│   ├── controllers/          # API controllers (auth, messages, users)
│   ├── middlewares/          # Authorization with JWT
│   ├── models/               # API models (message, user)
│   ├── routes/               # API routes
│   ├── public/uploads/       # File uploads (e.g., images)
│   ├── utils/                # Helper functions
│   ├── __tests__/            # Unit and integration tests
│   ├── Dockerfile            # Dockerfile for backend
│   └── ...
├── frontend/
│   ├── src/                  # Vue.js components, views, and main app
│   ├── public/               # Static files for frontend
│   ├── Dockerfile            # Dockerfile for frontend
│   └── ...
├── docker-compose.yml         # Docker Compose file for backend and frontend
└── README.md                  # Project documentation
```

## Backend

### API Documentation

You can view the automatically generated API documentation using Swagger by visiting:  
[http://localhost:5001/api-docs](http://localhost:5001/api-docs)

### Available Scripts

- `npm start`: Starts the backend server.
- `npm test`: Runs backend tests.

### Dependencies

- **express**: Web framework for Node.js.
- **mongoose**: ODM for MongoDB.
- **socket.io**: Real-time communication library.
- **jsonwebtoken**: For JWT authentication.
- **cors**: Middleware for enabling CORS.
- **swagger-jsdoc**: Generates Swagger documentation.
- **swagger-ui-express**: Serves Swagger UI for API documentation.

### Dev Dependencies

- **jest**: Testing framework.
- **supertest**: HTTP assertions for tests.

## Frontend

The frontend is built using **Vue.js**, **Vuex** for state management, and **TailwindCSS** for responsive design.

### Project Setup

To install dependencies in the `frontend` directory:

```bash
npm install
```

### Available Scripts

- `npm run serve`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Lints the code.

### Dependencies

- **axios**: HTTP client.
- **vue**: Vue.js framework.
- **vue-router**: For navigation.
- **vuex**: State management.
- **socket.io-client**: Client-side WebSocket support.

### Dev Dependencies

- **@vue/cli-service**: Vue development tooling.
- **tailwindcss**: Utility-first CSS framework.

## Running Tests

Unit and integration tests are written for the backend.

1. **Navigate to the backend directory**:

   ```bash
   cd backend
   ```

2. **Run the tests**:

   ```bash
   npm test
   ```

   This will execute all the tests in the `__tests__` directory.

## License

This project is licensed under the **ISC License**.
