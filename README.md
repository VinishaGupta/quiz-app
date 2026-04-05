# Quiz App

Full-stack multi-user quiz platform built with `React + Tailwind + Node.js + MongoDB`.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, JWT, Mongoose
- Database: MongoDB

## Features

- User signup and login
- JWT-based authentication
- Quiz listing and quiz detail pages
- Timed quiz attempts
- Automatic score calculation
- Personal results history
- Admin dashboard with platform-wide metrics

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
copy server\\.env.example server\\.env
```

3. Update `server/.env` with your MongoDB connection string and JWT secret.

4. Seed sample data:

```bash
npm run seed
```

5. Start the backend:

```bash
npm run server:dev
```

6. Start the frontend in another terminal:

```bash
npm run client:dev
```

## Demo Accounts

After running the seed script:

- Admin: `admin@quizmaster.com` / `Admin@123`
- User: `student@quizmaster.com` / `Student@123`
