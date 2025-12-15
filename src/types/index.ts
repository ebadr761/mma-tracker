export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Workout {
  id: string;
  discipline: string;
  duration: number;
  intensity: number;
  notes: string;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkoutInput {
  discipline: string;
  duration: number;
  intensity: number;
  notes?: string;
  date?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token?: string;
  token_type?: string;
}

export interface WorkoutsResponse {
  workouts: Workout[];
}

export interface WorkoutResponse {
  message?: string;
  workout: Workout;
}

export interface WorkoutStats {
  totalSessions: number;
  totalDuration: number;
  avgIntensity: number;
}

export interface MLInsights {
  weaknesses: string[];
  burnout: {
    risk: string;
    reason: string;
    acwr?: number;
  };
  focus: string;
}
