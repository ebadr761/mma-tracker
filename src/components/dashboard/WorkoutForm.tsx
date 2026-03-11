import { Plus } from 'lucide-react';
import { DISCIPLINE_COLORS } from '../../constants';

interface FormData {
    discipline: string;
    duration: string;
    intensity: number;
    notes: string;
}

interface WorkoutFormProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
    onSubmit: () => Promise<void>;
    disciplines: string[];
}

export default function WorkoutForm({
    formData,
    setFormData,
    onSubmit,
    disciplines
}: WorkoutFormProps) {
    return (
        <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-8 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Log New Workout</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Discipline</label>
                    <div className="flex flex-wrap gap-2">
                        {disciplines.map(d => {
                            const color = DISCIPLINE_COLORS[d] || '#94a3b8';
                            const isSelected = formData.discipline === d;
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, discipline: d })}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                        isSelected
                                            ? 'text-white shadow-lg scale-105'
                                            : 'bg-slate-800/80 text-slate-400 border border-slate-600 hover:border-slate-500 hover:text-slate-300'
                                    }`}
                                    style={isSelected ? {
                                        backgroundColor: color,
                                        boxShadow: `0 4px 14px ${color}40`,
                                    } : undefined}
                                >
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        {d}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
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

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Intensity: {formData.intensity}/10</label>
                    <div className="flex gap-2">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setFormData({ ...formData, intensity: n })}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                                    formData.intensity === n
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'bg-slate-800 border border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
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
                    onClick={onSubmit}
                    className="md:col-span-2 bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                    <Plus className="w-5 h-5" /> Log Workout
                </button>
            </div>
        </div>
    );
}
