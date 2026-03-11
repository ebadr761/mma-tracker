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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs mb-1">Total Hours</p>
                        <p className="text-2xl font-bold">{totalHours}h</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-400 opacity-50" />
                </div>
            </div>

            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs mb-1">Sessions</p>
                        <p className="text-2xl font-bold">{totalSessions}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-emerald-400 opacity-50" />
                </div>
            </div>

            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs mb-1">Avg Intensity</p>
                        <p className="text-2xl font-bold">{avgIntensity}/10</p>
                    </div>
                    <Zap className="w-8 h-8 text-amber-400 opacity-50" />
                </div>
            </div>

            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs mb-1">Disciplines</p>
                        <p className="text-2xl font-bold">{disciplineCount}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
                </div>
            </div>
        </div>
    );
}
