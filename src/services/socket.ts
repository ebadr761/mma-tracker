import { io, Socket } from 'socket.io-client';
import { Workout } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.userId = userId;
    this.socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', this.socket?.id);
      if (this.userId) {
        this.socket?.emit('authenticate', this.userId);
      }
    });

    this.socket.on('authenticated', (data: { success: boolean }) => {
      if (data.success) {
        console.log('✅ Socket.IO authenticated');
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  onWorkoutCreated(callback: (workout: Workout) => void): void {
    this.socket?.on('workout:created', callback);
  }

  onWorkoutUpdated(callback: (workout: Workout) => void): void {
    this.socket?.on('workout:updated', callback);
  }

  onWorkoutDeleted(callback: (data: { id: string }) => void): void {
    this.socket?.on('workout:deleted', callback);
  }

  offWorkoutCreated(callback: (workout: Workout) => void): void {
    this.socket?.off('workout:created', callback);
  }

  offWorkoutUpdated(callback: (workout: Workout) => void): void {
    this.socket?.off('workout:updated', callback);
  }

  offWorkoutDeleted(callback: (data: { id: string }) => void): void {
    this.socket?.off('workout:deleted', callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
