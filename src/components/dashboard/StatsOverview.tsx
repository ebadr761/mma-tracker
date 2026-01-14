import { Clock, Calendar, Zap, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
    totalHours: number;
    totalSessions: number;
    avgIntensity: number;
    disciplineCount: number;
}

export default function StatsOverview({
    totalHours,
    totalSessions,
    avgIntensity,
    disciplineCount
}: StatsOverviewProps) {
    return (
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
                        <p className="text-3xl font-bold">{disciplineCount}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-400 opacity-50" />
                </div>
            </div>
        </div>
    );
}
