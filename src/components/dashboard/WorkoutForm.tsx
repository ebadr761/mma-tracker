import { Plus } from 'lucide-react';

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
                    onClick={onSubmit}
                    className="md:col-span-2 bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                    <Plus className="w-5 h-5" /> Log Workout
                </button>
            </div>
        </div>
    );
}
