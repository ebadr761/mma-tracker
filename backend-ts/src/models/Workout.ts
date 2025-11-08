import mongoose, { Schema, Types } from 'mongoose';
import { IWorkout, WorkoutStats } from '../types';

const workoutSchema = new Schema<IWorkout>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  discipline: {
    type: String,
    required: true,
    enum: [
      'Boxing',
      'Wrestling',
      'BJJ',
      'Muay Thai',
      'Strength & Conditioning',
      'Cardio',
      'Mobility',
      'Sprints',
      'Squats',
      'Bench Press'
    ]
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true,
  collection: 'workouts'
});

// Indexes for faster queries
workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ userId: 1, discipline: 1 });

// Static method to get user statistics
workoutSchema.statics.getStats = async function(
  userId: string | Types.ObjectId
): Promise<WorkoutStats | null> {
  const pipeline = [
    {
      $match: { userId: new Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        avgIntensity: { $avg: '$intensity' }
      }
    }
  ];

  const result = await this.aggregate(pipeline);

  if (result.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      avgIntensity: 0
    };
  }

  return {
    totalSessions: result[0].totalSessions,
    totalDuration: result[0].totalDuration,
    avgIntensity: Math.round(result[0].avgIntensity * 10) / 10
  };
};

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
