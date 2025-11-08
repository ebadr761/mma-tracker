import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  verifyPassword(password: string): Promise<boolean>;
}

export interface IWorkout extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  discipline: string;
  duration: number;
  intensity: number;
  notes: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutStats {
  totalSessions: number;
  totalDuration: number;
  avgIntensity: number;
}

export interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  timestamp: Date;
  statusCode: number;
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
