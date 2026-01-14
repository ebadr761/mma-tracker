import { Brain } from 'lucide-react';
import { MLInsights } from '../../types';

interface InsightsWidgetProps {
    insights: MLInsights | null;
}

export default function InsightsWidget({ insights }: InsightsWidgetProps) {
    if (!insights) return null;

    return (
        <div className="mb-8 bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-violet-500/30 rounded-lg p-6 backdrop-blur">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-fuchsia-400" />
                <h2 className="text-2xl font-bold text-white">AI Training Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-violet-500/20">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase mb-2">Recommended Focus</h3>
                    <p className="text-2xl font-bold text-fuchsia-300">{insights.focus}</p>
                    <p className="text-xs text-slate-500 mt-1">Based on discipline balance</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-violet-500/20">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase mb-2">Burnout Risk</h3>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${insights.burnout.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                            insights.burnout.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-emerald-500/20 text-emerald-400'
                            }`}>
                            {insights.burnout.risk}
                        </span>
                        {insights.burnout.acwr && <span className="text-xs text-slate-500">(ACWR: {insights.burnout.acwr})</span>}
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{insights.burnout.reason}</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-violet-500/20">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase mb-2">Weakness Analysis</h3>
                    <ul className="space-y-1">
                        {insights.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-violet-400 mt-1">•</span>
                                {w}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
