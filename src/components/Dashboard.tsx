import { useState, useEffect } from 'react';
import { TrendingUp, User, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { workoutsAPI, mlAPI } from '../services/api';
import { socketService } from '../services/socket';
import { Workout, MLInsights } from '../types';
import { DISCIPLINES, DISCIPLINE_COLORS } from '../constants';

// Sub-components
import StatsOverview from './dashboard/StatsOverview';
import InsightsWidget from './dashboard/InsightsWidget';
import WorkoutForm from './dashboard/WorkoutForm';
import WorkoutHistory from './dashboard/WorkoutHistory';
import WorkoutCharts from './dashboard/WorkoutCharts';

interface FormData {
  discipline: string;
  duration: string;
  intensity: number;
  notes: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [insights, setInsights] = useState<MLInsights | null>(null);

  const [formData, setFormData] = useState<FormData>({
    discipline: 'Boxing',
    duration: '',
    intensity: 7,
    notes: ''
  });

  const [activeTab, setActiveTab] = useState<'log' | 'history' | 'analytics'>('log');

  // Fetch workouts on mount
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Set up Socket.IO real-time updates
  useEffect(() => {
    setIsSocketConnected(socketService.isConnected());

    const handleWorkoutCreated = (workout: Workout) => {
      console.log('🔔 Real-time: Workout created', workout);
      setWorkouts(prev => [workout, ...prev]);
      setSuccessMessage('New workout added (real-time)');
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleWorkoutUpdated = (workout: Workout) => {
      console.log('🔔 Real-time: Workout updated', workout);
      setWorkouts(prev => prev.map(w => w.id === workout.id ? workout : w));
      setSuccessMessage('Workout updated (real-time)');
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleWorkoutDeleted = (data: { id: string }) => {
      console.log('🔔 Real-time: Workout deleted', data.id);
      setWorkouts(prev => prev.filter(w => w.id !== data.id));
      setSuccessMessage('Workout deleted (real-time)');
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    socketService.onWorkoutCreated(handleWorkoutCreated);
    socketService.onWorkoutUpdated(handleWorkoutUpdated);
    socketService.onWorkoutDeleted(handleWorkoutDeleted);

    return () => {
      socketService.offWorkoutCreated(handleWorkoutCreated);
      socketService.offWorkoutUpdated(handleWorkoutUpdated);
      socketService.offWorkoutDeleted(handleWorkoutDeleted);
    };
  }, []);

  const fetchWorkouts = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await workoutsAPI.getAll();
      setWorkouts(data.workouts);
      setError('');
    } catch (err) {
      setError('Failed to load workouts');
      console.error('Fetch workouts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (): Promise<void> => {
    try {
      const data = await mlAPI.getInsights();
      setInsights(data);
    } catch (err) {
      console.error('Failed to fetch insights', err);
    }
  };

  useEffect(() => {
    if (workouts.length > 0) {
      fetchInsights();
    }
  }, [workouts]);

  const addWorkout = async (): Promise<void> => {
    if (!formData.duration) {
      setError('Please enter duration');
      return;
    }

    try {
      setError('');
      const data = await workoutsAPI.create({
        discipline: formData.discipline,
        duration: parseInt(formData.duration),
        intensity: formData.intensity,
        notes: formData.notes,
        date: new Date().toISOString().split('T')[0]
      });

      // Only add to local state if not using real-time updates
      // Real-time will handle it via socket
      if (!socketService.isConnected()) {
        setWorkouts([data.workout, ...workouts]);
      }

      setFormData({ discipline: 'Boxing', duration: '', intensity: 7, notes: '' });
      setSuccessMessage('Workout logged successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add workout');
      console.error('Add workout error:', err);
    }
  };

  const deleteWorkout = async (id: string): Promise<void> => {
    try {
      await workoutsAPI.delete(id);

      // Only remove from local state if not using real-time updates
      if (!socketService.isConnected()) {
        setWorkouts(workouts.filter(w => w.id !== id));
      }

      setSuccessMessage('Workout deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete workout');
      console.error('Delete workout error:', err);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  // Stats calculations
  const totalHours = Math.round((workouts.reduce((sum, w) => sum + w.duration, 0) / 60) * 10) / 10;
  const avgIntensity = workouts.length > 0 ? Math.round((workouts.reduce((sum, w) => sum + w.intensity, 0) / workouts.length) * 10) / 10 : 0;
  const totalSessions = workouts.length;

  // Discipline breakdown
  const disciplineData = DISCIPLINES.map(d => ({
    name: d,
    hours: Math.round((workouts.filter(w => w.discipline === d).reduce((sum, w) => sum + w.duration, 0) / 60) * 10) / 10
  })).filter(d => d.hours > 0);

  // Timeline data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      sessions: dayWorkouts.length,
      hours: Math.round((dayWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60) * 10) / 10
    };
  });

  if (loading && workouts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">MMA Athletic Disciplines Manager</h1>
              {isSocketConnected ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  <Wifi className="w-3 h-3" /> Real-time
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-400/10 px-2 py-1 rounded-full">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              )}
            </div>
            <p className="text-slate-400">Welcome back, {user?.username}! Track your training and dominate your goals</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition"
          >
            <User className="w-4 h-4" />
            <span className="font-semibold">{user?.username}</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg flex items-center gap-3 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <StatsOverview
          totalHours={totalHours}
          totalSessions={totalSessions}
          avgIntensity={avgIntensity}
          disciplineCount={disciplineData.length}
        />

        {/* AI Insights Section */}
        <InsightsWidget insights={insights} />

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('log')}
            className={`pb-3 px-4 font-semibold transition ${activeTab === 'log' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Log Workout
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-semibold transition ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-4 font-semibold transition ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Analytics
          </button>
        </div>

        {/* Log Workout Tab */}
        {activeTab === 'log' && (
          <WorkoutForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={addWorkout}
            disciplines={DISCIPLINES}
          />
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <WorkoutHistory
            workouts={workouts}
            onDelete={deleteWorkout}
            onLogClick={() => setActiveTab('log')}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {workouts.length === 0 ? (
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-12 backdrop-blur text-center">
                <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No analytics yet</h3>
                <p className="text-slate-400 mb-6">Log some workouts to see your training insights</p>
                <button
                  onClick={() => setActiveTab('log')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
                >
                  Start Training
                </button>
              </div>
            ) : (
              <WorkoutCharts
                disciplineData={disciplineData}
                last7Days={last7Days}
                colors={DISCIPLINE_COLORS}
              />
            )}
          </div>
        )}
      </div>
    </div >
  );
}

// Missing import fix
import { LogOut } from 'lucide-react';
