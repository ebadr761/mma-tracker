import { Router, Request, Response } from 'express';
import { Workout } from '../models/Workout';
import { requireAuth } from '../middleware/auth';
import { Server as SocketIOServer } from 'socket.io';

const router = Router();

// Socket.io instance will be injected
let io: SocketIOServer;

export const setSocketIO = (socketIO: SocketIOServer) => {
  io = socketIO;
};

// Get all workouts for authenticated user
router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId!;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;

    const workouts = await Workout
      .find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedWorkouts = workouts.map(w => ({
      id: w._id.toString(),
      discipline: w.discipline,
      duration: w.duration,
      intensity: w.intensity,
      notes: w.notes,
      date: w.date,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt
    }));

    res.status(200).json({
      workouts: formattedWorkouts
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Failed to get workouts' });
  }
});

// Create new workout
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId!;
    const { discipline, duration, intensity, notes, date } = req.body;

    // Validate input
    if (!discipline || !duration || !intensity) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (duration < 1) {
      res.status(400).json({ error: 'Duration must be at least 1 minute' });
      return;
    }

    if (intensity < 1 || intensity > 10) {
      res.status(400).json({ error: 'Intensity must be between 1 and 10' });
      return;
    }

    // Create workout
    const workout = await Workout.create({
      userId,
      discipline,
      duration: parseInt(duration),
      intensity: parseInt(intensity),
      notes: notes || '',
      date: date || new Date().toISOString().split('T')[0]
    });

    const formattedWorkout = {
      id: workout._id.toString(),
      discipline: workout.discipline,
      duration: workout.duration,
      intensity: workout.intensity,
      notes: workout.notes,
      date: workout.date,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt
    };

    // Emit real-time update to all connected clients for this user
    if (io) {
      io.to(`user:${userId}`).emit('workout:created', formattedWorkout);
    }

    res.status(201).json({
      message: 'Workout created successfully',
      workout: formattedWorkout
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// Get specific workout
router.get('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId!;
    const workoutId = req.params.id;

    const workout = await Workout.findOne({
      _id: workoutId,
      userId
    });

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.status(200).json({
      workout: {
        id: workout._id.toString(),
        discipline: workout.discipline,
        duration: workout.duration,
        intensity: workout.intensity,
        notes: workout.notes,
        date: workout.date,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt
      }
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ error: 'Failed to get workout' });
  }
});

// Update workout
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId!;
    const workoutId = req.params.id;
    const { discipline, duration, intensity, notes, date } = req.body;

    const updateData: any = {};
    if (discipline !== undefined) updateData.discipline = discipline;
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (intensity !== undefined) updateData.intensity = parseInt(intensity);
    if (notes !== undefined) updateData.notes = notes;
    if (date !== undefined) updateData.date = date;

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId },
      updateData,
      { new: true }
    );

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    const formattedWorkout = {
      id: workout._id.toString(),
      discipline: workout.discipline,
      duration: workout.duration,
      intensity: workout.intensity,
      notes: workout.notes,
      date: workout.date,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt
    };

    // Emit real-time update
    if (io) {
      io.to(`user:${userId}`).emit('workout:updated', formattedWorkout);
    }

    res.status(200).json({
      message: 'Workout updated successfully',
      workout: formattedWorkout
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// Delete workout
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId!;
    const workoutId = req.params.id;

    const workout = await Workout.findOneAndDelete({
      _id: workoutId,
      userId
    });

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    // Emit real-time update
    if (io) {
      io.to(`user:${userId}`).emit('workout:deleted', { id: workoutId });
    }

    res.status(200).json({
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

// Get workout statistics
router.get('/stats/summary', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId!;

    const stats = await (Workout as any).getStats(userId);

    res.status(200).json({
      stats: stats || {
        totalSessions: 0,
        totalDuration: 0,
        avgIntensity: 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;
