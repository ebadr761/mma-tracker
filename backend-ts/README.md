# MMA Tracker Backend - TypeScript Edition

Modern backend API built with **Node.js, Express.js, and TypeScript** with real-time features using Socket.io.

## Tech Stack

- **Node.js** + **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** + **Mongoose** - Database with ODM
- **Socket.io** - Real-time bidirectional communication
- **bcrypt** - Password hashing
- **express-session** + **connect-mongo** - Session management

## Features

- Full TypeScript implementation with strict typing
- Real-time updates via Socket.io
- Session-based authentication
- Performance monitoring middleware (tracks response times)
- Indexed MongoDB queries for optimal performance
- CORS enabled with credentials support

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file (see `.env.example` for reference):

```bash
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check auth status

### Workouts
- `GET /api/workouts` - Get all workouts (with pagination)
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats/summary` - Get workout statistics

### Monitoring
- `GET /api/health` - Health check
- `GET /api/metrics` - Performance metrics

## Real-time Events

### Socket.io Events

**Client → Server:**
- `authenticate` - Authenticate socket connection with user ID

**Server → Client:**
- `authenticated` - Confirmation of successful authentication
- `workout:created` - New workout was created
- `workout:updated` - Workout was updated
- `workout:deleted` - Workout was deleted

## Performance Monitoring

The backend tracks all API response times and provides metrics via `/api/metrics`:
- Average response time
- P50, P95, P99 percentiles
- Slowest endpoints

All responses are logged with color-coded performance indicators:
- 🟢 Green: < 100ms
- 🟡 Yellow: 100-200ms
- 🔴 Red: > 200ms

## Project Structure

```
backend-ts/
├── src/
│   ├── config/          # Database & environment config
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Main server file
├── dist/                # Compiled JavaScript (generated)
├── package.json
└── tsconfig.json
```

## Disclaimer
This is my first backend portion of an application that is built WITHOUT Python. Let me know if you see things that can be made better or if you have suggestions in mind. Learning Node.js and Express.js was the main reason for creating this backend.
