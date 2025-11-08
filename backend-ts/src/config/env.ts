import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  sessionSecret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  session: {
    name: 'mma.sid',
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax' as const
    }
  }
};

// Validate required environment variables
if (!config.mongodbUri) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

if (config.sessionSecret === 'default-secret-change-in-production' && config.nodeEnv === 'production') {
  console.error('❌ SESSION_SECRET must be set in production');
  process.exit(1);
}
