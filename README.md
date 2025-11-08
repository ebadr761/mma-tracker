# MMA Tracker 🥊

> A modern, full-stack athletic performance tracking system built with TypeScript, featuring real-time updates, interactive analytics, and performance monitoring for combat sports athletes.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Real-time Features](#real-time-features)
- [Performance Monitoring](#performance-monitoring)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## 🎯 Overview

MMA Tracker is a comprehensive athletic performance tracking system designed for combat sports athletes. Built with a modern TypeScript stack, it provides real-time workout synchronization, detailed analytics, and performance insights across multiple martial arts disciplines.

**Key Highlights:**
- 📊 Track training across 10+ combat sports disciplines
- ⚡ Real-time workout synchronization using Socket.io
- 📈 Interactive data visualizations with Recharts
- 🔐 Secure session-based authentication
- 🚀 Performance monitoring with sub-200ms query times
- 💪 Full TypeScript implementation for type safety

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user registration and login with bcrypt password hashing
- Session-based authentication with HTTP-only cookies
- User data isolation - each athlete sees only their own workouts
- Input validation on both client and server
- CORS protection with credential support

### 💪 Workout Management
- **Log Workouts**: Track discipline, duration, intensity (1-10), notes, and date
- **CRUD Operations**: Create, read, update, and delete workout records
- **Real-time Sync**: Changes appear instantly across all devices/tabs
- **Personal Dashboard**: User-specific training history and progress

### 📊 Analytics & Insights
- **Live Statistics**: Total hours, session count, average intensity, active disciplines
- **Interactive Charts**:
  - Bar chart: Hours per discipline
  - Line chart: 7-day activity trends
  - Pie chart: Discipline distribution
- **Performance Trends**: Identify patterns and track progress over time

### 🎨 User Experience
- Modern dark theme UI built with TailwindCSS 4
- Responsive design - works on desktop, tablet, and mobile
- Real-time connection status indicator
- Smooth loading states and transitions
- Clear error messages and user feedback
- Auto-clearing errors when typing

### ⚡ Real-time Features
- **Live Updates**: Workouts sync automatically across all devices
- **WebSocket Connection**: Socket.io for bidirectional communication
- **Instant Notifications**: See changes as they happen
- **Multi-tab Support**: Updates appear across all open tabs

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | Modern UI library with hooks |
| **TypeScript 5.3** | Type-safe JavaScript |
| **Vite** | Lightning-fast build tool |
| **TailwindCSS 4** | Utility-first CSS framework |
| **Recharts 3** | Interactive data visualizations |
| **Socket.io Client** | Real-time WebSocket communication |
| **Axios** | Type-safe HTTP client |
| **Lucide React** | Beautiful icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 20+** | JavaScript runtime |
| **Express.js 4.18** | Web application framework |
| **TypeScript 5.3** | Type-safe server code |
| **MongoDB + Mongoose 8.0** | Database with ODM |
| **Socket.io 4.6** | Real-time bidirectional events |
| **bcrypt** | Secure password hashing |
| **express-session** | Session management |
| **connect-mongo** | MongoDB session store |

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **ts-node** - TypeScript execution
- **nodemon** - Auto-restart on changes

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** free account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Quick Start (Recommended)

```bash
# Clone the repository
git clone https://github.com/ebadr761/mma-tracker.git
cd mma-tracker

# Run the quick start script
./start.sh
```

The script will:
1. Install all dependencies
2. Start the TypeScript backend on port 5000
3. Start the React frontend on port 5173
4. Open your browser to http://localhost:5173

### Manual Setup

#### 1️⃣ MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 free tier)
3. Create a database user with read/write permissions
4. Whitelist your IP (or `0.0.0.0/0` for development)
5. Get your connection string: `mongodb+srv://...`

#### 2️⃣ Backend Setup

```bash
# Navigate to TypeScript backend
cd backend-ts

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGODB_URI=mongodb+srv://...
# SESSION_SECRET=your-secret-key-here
```

Generate a secure session secret:
```bash
node -c "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3️⃣ Frontend Setup

```bash
# From project root
npm install
```

#### 4️⃣ Run the Application

**Terminal 1 - Backend:**
```bash
cd backend-ts
npm run dev
```
Server starts on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend starts on `http://localhost:5173`

#### 5️⃣ Create Your Account

1. Navigate to `http://localhost:5173`
2. Click **"Sign up"**
3. Fill in username, email, and password
4. Start tracking your training!

---

## 📁 Project Structure

```
mma-tracker/
├── backend-ts/                  # TypeScript backend (CURRENT)
│   ├── src/
│   │   ├── config/             # Database & environment config
│   │   │   ├── database.ts     # MongoDB connection
│   │   │   └── env.ts          # Environment variables
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.ts         # Authentication middleware
│   │   │   └── performance.ts  # Performance monitoring
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.ts         # User model with auth
│   │   │   └── Workout.ts      # Workout model with stats
│   │   ├── routes/             # API routes
│   │   │   ├── auth.ts         # Auth endpoints
│   │   │   └── workouts.ts     # Workout CRUD + Socket.io
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts        # Shared interfaces
│   │   └── server.ts           # Main server + Socket.io
│   ├── dist/                   # Compiled JavaScript (gitignored)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                    # Environment variables (create this)
│
├── backend/                     # Python/Flask backend (DEPRECATED)
│   └── ...                     # Legacy code - use backend-ts instead
│
├── src/                        # React frontend
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard with charts
│   │   ├── Login.tsx           # Login form
│   │   └── Register.tsx        # Registration form
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── services/
│   │   ├── api.ts              # Axios HTTP client
│   │   └── socket.ts           # Socket.io client
│   ├── types/
│   │   └── index.ts            # Frontend type definitions
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles
│
├── public/                     # Static assets
├── start.sh                    # Quick start script
├── package.json                # Frontend dependencies
├── tsconfig.json               # Frontend TypeScript config
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # TailwindCSS config
└── README.md                   # You are here!
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "fighter123",
  "email": "fighter@example.com",
  "password": "securepass123"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "fighter123",
    "email": "fighter@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "fighter@example.com",
  "password": "securepass123"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": { ... }
}
```

#### Logout User
```http
POST /api/auth/logout

Response: 200 OK
{
  "message": "Logout successful"
}
```

#### Get Current User
```http
GET /api/auth/me

Response: 200 OK
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "fighter123",
    "email": "fighter@example.com"
  }
}
```

### Workout Endpoints

#### Get All Workouts
```http
GET /api/workouts?limit=100&skip=0

Response: 200 OK
{
  "workouts": [
    {
      "id": "507f1f77bcf86cd799439011",
      "discipline": "Boxing",
      "duration": 90,
      "intensity": 8,
      "notes": "Heavy bag work, focused on combinations",
      "date": "2025-11-07",
      "createdAt": "2025-11-07T10:30:00Z",
      "updatedAt": "2025-11-07T10:30:00Z"
    }
  ]
}
```

#### Create Workout
```http
POST /api/workouts
Content-Type: application/json

{
  "discipline": "BJJ",
  "duration": 120,
  "intensity": 7,
  "notes": "Worked on guard passes",
  "date": "2025-11-07"
}

Response: 201 Created
{
  "message": "Workout created successfully",
  "workout": { ... }
}
```

#### Update Workout
```http
PUT /api/workouts/:id
Content-Type: application/json

{
  "intensity": 9,
  "notes": "Updated notes - great session!"
}

Response: 200 OK
{
  "message": "Workout updated successfully",
  "workout": { ... }
}
```

#### Delete Workout
```http
DELETE /api/workouts/:id

Response: 200 OK
{
  "message": "Workout deleted successfully"
}
```

#### Get Workout Statistics
```http
GET /api/workouts/stats/summary

Response: 200 OK
{
  "stats": {
    "totalSessions": 42,
    "totalDuration": 3840,
    "avgIntensity": 7.5
  }
}
```

### Monitoring Endpoints

#### Health Check
```http
GET /api/health

Response: 200 OK
{
  "status": "healthy",
  "message": "MMA Tracker API is running",
  "timestamp": "2025-11-07T10:30:00Z"
}
```

#### Performance Metrics
```http
GET /api/metrics

Response: 200 OK
{
  "summary": {
    "total": 1523,
    "average": 45,
    "p50": 32,
    "p95": 89,
    "p99": 156,
    "slowestEndpoints": [
      { "endpoint": "GET /api/workouts", "avgTime": 78 }
    ]
  },
  "recent": [ ... ]
}
```

---

## ⚡ Real-time Features

### Socket.io Events

**Server → Client Events:**

```typescript
// New workout created
socket.on('workout:created', (workout: Workout) => {
  // Workout object with all fields
  console.log('New workout:', workout);
});

// Workout updated
socket.on('workout:updated', (workout: Workout) => {
  // Updated workout object
  console.log('Updated workout:', workout);
});

// Workout deleted
socket.on('workout:deleted', (data: { id: string }) => {
  // Workout ID that was deleted
  console.log('Deleted workout ID:', data.id);
});

// Authentication confirmation
socket.on('authenticated', (data: { success: boolean }) => {
  console.log('Socket authenticated:', data.success);
});
```

**Client → Server Events:**

```typescript
// Authenticate socket with user ID
socket.emit('authenticate', userId);
```

### How Real-time Works

1. User logs in → Socket.io connection established
2. Socket authenticated with user ID → joined to user-specific room
3. User creates/updates/deletes workout → API call made
4. Server broadcasts event → all sockets in user's room receive update
5. Frontend updates UI → changes visible across all tabs/devices

**Example: Multi-tab Sync**
```
Tab 1: Add workout → POST /api/workouts
Server: Broadcasts 'workout:created' event
Tab 2: Receives event → Updates workout list automatically
Tab 3: Receives event → Updates workout list automatically
```

---

## 📊 Performance Monitoring

### Built-in Metrics

The backend tracks **every API request** with:
- Response time in milliseconds
- HTTP method and endpoint
- Status code
- Timestamp

**Color-coded Console Logs:**
- 🟢 Green: < 100ms (excellent)
- 🟡 Yellow: 100-200ms (acceptable)
- 🔴 Red: > 200ms (needs optimization)

**Example Output:**
```
⚡ GET /api/workouts - 45ms - 200
⚡ POST /api/workouts - 67ms - 201
⚡ GET /api/workouts/stats/summary - 123ms - 200
```

### Accessing Metrics

Visit `http://localhost:5000/api/metrics` to see:
- Total requests tracked
- Average response time
- P50, P95, P99 percentiles
- Slowest endpoints with average times

**Example Response:**
```json
{
  "summary": {
    "total": 1523,
    "average": 45,
    "p50": 32,
    "p95": 89,
    "p99": 156
  }
}
```

### Database Optimization

**Indexes for Fast Queries:**
```typescript
// User model
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Workout model
workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ userId: 1, discipline: 1 });
```

Most queries complete in **< 50ms** thanks to proper indexing.

---

## 🏋️ Supported Disciplines

- Boxing
- Wrestling
- Brazilian Jiu-Jitsu (BJJ)
- Muay Thai
- Strength & Conditioning
- Cardio
- Mobility
- Sprints
- Squats
- Bench Press

*Easily customizable in `src/components/Dashboard.tsx`*

---

## 🚀 Deployment

### Backend Deployment (Railway, Render, Heroku)

1. **Push code to GitHub**
2. **Connect repository** to hosting platform
3. **Set environment variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.com
   ```
4. **Build command:** `npm run build`
5. **Start command:** `npm start`

### Frontend Deployment (Vercel, Netlify, Cloudflare Pages)

1. **Connect GitHub repository**
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. **Update API URLs** in:
   - `src/services/api.ts` - Change `baseURL` to your backend URL
   - `src/services/socket.ts` - Change Socket.io URL

### MongoDB Atlas Production Setup

1. **Update IP Whitelist** to include hosting provider IPs
2. **Use strong database credentials**
3. **Enable MongoDB Atlas monitoring**
4. **Set up automated backups**

---

## 🔮 Future Enhancements

See [`BRAINSTORMING.md`](BRAINSTORMING.md) for 30+ innovative feature ideas including:

**High Priority:**
- 📱 React Native mobile app
- 🤖 AI training insights and recommendations
- ⌚ Wearable device integration (Apple Watch, Fitbit, Whoop)
- 🎥 Video technique analysis with pose detection
- 👥 Social features (training partner matching, leaderboards)

**Analytics:**
- 📈 Predictive performance modeling
- 🏆 Competition prep planning
- 💪 Recovery metrics dashboard
- 📊 Advanced trend analysis

**Technical:**
- 🔌 GraphQL API
- 🏗️ Microservices architecture
- 🌐 Progressive Web App (PWA)
- 📤 Data export (CSV, PDF, JSON)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Write type-safe TypeScript code
- Follow existing code style (ESLint + Prettier)
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📞 Contact & Links

- **Developer:** Ebad ur Rehman
- **Email:** ebadrehman99@gmail.com
- **GitHub:** [@ebadr761](https://github.com/ebadr761)
- **Project Link:** [github.com/ebadr761/mma-tracker](https://github.com/ebadr761/mma-tracker)

---

## 🙏 Acknowledgments

- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **UI Framework:** [TailwindCSS](https://tailwindcss.com/)
- **Real-time:** [Socket.io](https://socket.io/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 📚 Documentation

- [`BRAINSTORMING.md`](BRAINSTORMING.md) - Future ideas and technical Q&A
- [`UPGRADE_GUIDE.md`](UPGRADE_GUIDE.md) - TypeScript migration guide
- [`MIGRATION_COMPLETE.md`](MIGRATION_COMPLETE.md) - Migration summary
- [`AUTH_FEEDBACK_FIXES.md`](AUTH_FEEDBACK_FIXES.md) - Authentication improvements
- [`backend-ts/README.md`](backend-ts/README.md) - Backend API documentation

---

<div align="center">

**Built with 💪 for martial arts athletes by martial artists**

*Track smarter. Train harder. Achieve more.*

</div>
