# 🔐 Auth & Roles Microservice

An intermediate-level **Authentication & Role-Based Access Control (RBAC) microservice** built with **Node.js, Express, PostgreSQL (Sequelize), and Redis**.  
This project implements secure user authentication, JWT access/refresh tokens, Redis-based session management, and role-based authorization with an admin dashboard for user management.

---

## ⚡ Features
- User Registration & Login with **hashed passwords (bcrypt)**
- JWT-based **Access & Refresh tokens**
- **Redis** for refresh token storage & session management
- Role-based access (`user`, `editor`, `admin`)
- Admin CRUD APIs for managing users
- Sequelize ORM with migrations
- Secure response format with consistent JSON output

---

## 🛠 Tech Stack
- **Node.js + Express** → Backend framework
- **PostgreSQL + Sequelize** → Database & ORM
- **Redis** → Session/refresh token management
- **JWT** → Authentication tokens
- **bcrypt** → Password hashing

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/auth-roles-microservice.git
cd auth-roles-microservice
```

### 2. Install Dependencies
```bash
- npm install
```

### 3. Setup PostgreSQL
```bash
-Make sure PostgreSQL is installed and running.
 Create a database (example: auth_db):

- CREATE DATABASE auth_db;
```

### 4. Configure Environment Variables
```bash
Create a .env file in the project root:

PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_pg_username
DB_PASS=your_pg_password
DB_NAME=auth_db

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 5. Run Database Migrations
```bash
- npx sequelize-cli db:migrate
```
### 6. Start Redis

```bash
- redis-server

Or run via Docker

- docker run --name redis -p 6379:6379 -d redis
```
### 7. Start the Server
```bash
- npm run dev

## Server will start on http://localhost:5000
```
