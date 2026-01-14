import { Trash2, Calendar } from 'lucide-react';
import { Workout } from '../../types';
import { DISCIPLINE_COLORS } from '../../constants';

interface WorkoutHistoryProps {
    workouts: Workout[];
    onDelete: (id: string) => void;
    onLogClick: () => void;
}

export default function WorkoutHistory({ workouts, onDelete, onLogClick }: WorkoutHistoryProps) {
    if (workouts.length === 0) {
        return (
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-12 backdrop-blur text-center">
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No workouts yet</h3>
                <p className="text-slate-400 mb-6">Start logging your training sessions to see them here</p>
                <button
                    onClick={onLogClick}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
                >
                    Log Your First Workout
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {workouts.map(workout => (
                <div key={workout.id} className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur flex justify-between items-start hover:border-slate-500 transition">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: DISCIPLINE_COLORS[workout.discipline] || '#ccc' }}
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
                        onClick={() => onDelete(workout.id)}
                        className="text-red-400 hover:text-red-300 transition"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
