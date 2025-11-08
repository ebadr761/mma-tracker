import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { Database } from './config/database';
import authRoutes from './routes/auth';
import workoutRoutes, { setSocketIO } from './routes/workouts';
import { performanceMonitor, getMetrics, getRecentMetrics } from './middleware/performance';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Create Socket.IO server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigin,
    credentials: true
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  ...config.session,
  store: MongoStore.create({
    mongoUrl: config.mongodbUri,
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7 // 7 days
  })
}));

// Performance monitoring middleware
app.use(performanceMonitor);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Inject Socket.IO into workout routes
setSocketIO(io);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    message: 'MMA Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Performance metrics endpoint
app.get('/api/metrics', (_req: Request, res: Response) => {
  const metrics = getMetrics();
  const recent = getRecentMetrics();

  res.status(200).json({
    summary: metrics,
    recent: recent.slice(-20) // Last 20 requests
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'MMA Tracker API - TypeScript Edition',
    version: '2.0.0',
    stack: 'Node.js + Express.js + TypeScript + MongoDB + Socket.io',
    endpoints: {
      auth: '/api/auth',
      workouts: '/api/workouts',
      health: '/api/health',
      metrics: '/api/metrics'
    }
  });
});

// Error handlers
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Resource not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join user-specific room after authentication
  socket.on('authenticate', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`✅ User ${userId} authenticated on socket ${socket.id}`);
    socket.emit('authenticated', { success: true });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    const db = Database.getInstance();
    await db.connect();

    // Start listening
    httpServer.listen(config.port, () => {
      console.log('='.repeat(60));
      console.log('🥊 MMA Tracker API Server (TypeScript Edition)');
      console.log('='.repeat(60));
      console.log(`🚀 Server running on: http://localhost:${config.port}`);
      console.log(`⚡ Socket.IO enabled for real-time updates`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📊 Performance monitoring: ENABLED`);
      console.log('\n📋 API Endpoints:');
      console.log(`  - Auth:      http://localhost:${config.port}/api/auth`);
      console.log(`  - Workouts:  http://localhost:${config.port}/api/workouts`);
      console.log(`  - Health:    http://localhost:${config.port}/api/health`);
      console.log(`  - Metrics:   http://localhost:${config.port}/api/metrics`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  httpServer.close(async () => {
    const db = Database.getInstance();
    await db.disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('\n👋 SIGINT received, shutting down gracefully...');
  httpServer.close(async () => {
    const db = Database.getInstance();
    await db.disconnect();
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, io };
