import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, TrendingUp, Clock, Zap, Calendar, LogOut, User, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { workoutsAPI } from '../services/api';
import { socketService } from '../services/socket';
import { Workout } from '../types';

const disciplines = ['Boxing', 'Wrestling', 'BJJ', 'Muay Thai', 'Strength & Conditioning', 'Cardio', 'Mobility', 'Sprints', 'Squats', 'Bench Press'];

const colors: Record<string, string> = {
  'Boxing': '#EF4444',
  'Wrestling': '#3B82F6',
  'BJJ': '#8B5CF6',
  'Muay Thai': '#F59E0B',
  'Strength & Conditioning': '#10B981',
  'Cardio': '#06B6D4',
  'Mobility': '#EC4899',
  'Sprints': '#F97316',
  'Squats': '#14B8A6',
  'Bench Press': '#8B5CF6'
};

interface FormData {
  discipline: string;
  duration: string;
  intensity: number;
  notes: string;
}

interface ChartData {
  name: string;
  hours: number;
  [key: string]: string | number;
}

interface TimelineData {
  date: string;
  sessions: number;
  hours: number;
  [key: string]: string | number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

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
        notes: formData.notes
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
  const disciplineData: ChartData[] = disciplines.map(d => ({
    name: d,
    hours: Math.round((workouts.filter(w => w.discipline === d).reduce((sum, w) => sum + w.duration, 0) / 60) * 10) / 10
  })).filter(d => d.hours > 0);

  // Timeline data (last 7 days)
  const last7Days: TimelineData[] = Array.from({ length: 7 }, (_, i) => {
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Hours</p>
                <p className="text-3xl font-bold">{totalHours}h</p>
              </div>
              <Clock className="w-10 h-10 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Sessions</p>
                <p className="text-3xl font-bold">{totalSessions}</p>
              </div>
              <Calendar className="w-10 h-10 text-emerald-400 opacity-50" />
            </div>
          </div>

          <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Avg Intensity</p>
                <p className="text-3xl font-bold">{avgIntensity}/10</p>
              </div>
              <Zap className="w-10 h-10 text-amber-400 opacity-50" />
            </div>
          </div>

          <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Disciplines</p>
                <p className="text-3xl font-bold">{disciplineData.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
          </div>
        </div>

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
          <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-8 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Log New Workout</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Discipline</label>
                <select
                  value={formData.discipline}
                  onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  {disciplines.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="90"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Intensity: {formData.intensity}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What did you work on? How did you feel?"
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                onClick={addWorkout}
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-5 h-5" /> Log Workout
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {workouts.length === 0 ? (
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-12 backdrop-blur text-center">
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No workouts yet</h3>
                <p className="text-slate-400 mb-6">Start logging your training sessions to see them here</p>
                <button
                  onClick={() => setActiveTab('log')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
                >
                  Log Your First Workout
                </button>
              </div>
            ) : (
              workouts.map(workout => (
                <div key={workout.id} className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur flex justify-between items-start hover:border-slate-500 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[workout.discipline] }}
                      />
                      <h3 className="font-bold text-lg">{workout.discipline}</h3>
                      <span className="text-slate-400 text-sm">{workout.date}</span>
                    </div>
                    <div className="flex gap-6 text-slate-300 mb-2">
                      <span>{workout.duration} min</span>
                      <span>Intensity: {workout.intensity}/10</span>
                    </div>
                    {workout.notes && <p className="text-slate-400 text-sm">{workout.notes}</p>}
                  </div>
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
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
              <>
                <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-xl font-bold mb-4">Hours by Discipline</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={disciplineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                      <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur">
                  <h3 className="text-xl font-bold mb-4">Last 7 Days Activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={last7Days}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                      <Line type="monotone" dataKey="hours" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {disciplineData.length > 0 && (
                  <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur">
                    <h3 className="text-xl font-bold mb-4">Discipline Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={disciplineData}
                          dataKey="hours"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {disciplineData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
