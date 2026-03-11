import { Brain } from 'lucide-react';
import { MLInsights } from '../../types';

interface InsightsWidgetProps {
    insights: MLInsights | null;
}

export default function InsightsWidget({ insights }: InsightsWidgetProps) {
    if (!insights) return null;

    return (
        <div className="mb-8 bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 backdrop-blur">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold">AI Training Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-elevated rounded-lg p-4 border border-indigo-500/15">
                    <h3 className="text-ink-muted text-sm font-semibold uppercase mb-2">Recommended Focus</h3>
                    <p className="text-2xl font-bold text-accent-text">{insights.focus}</p>
                    <p className="text-xs text-ink-faint mt-1">Based on discipline balance</p>
                </div>

                <div className="bg-elevated rounded-lg p-4 border border-indigo-500/15">
                    <h3 className="text-ink-muted text-sm font-semibold uppercase mb-2">Burnout Risk</h3>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${insights.burnout.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                            insights.burnout.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-emerald-500/20 text-emerald-400'
                            }`}>
                            {insights.burnout.risk}
                        </span>
                        {insights.burnout.acwr && <span className="text-xs text-ink-faint">(ACWR: {insights.burnout.acwr})</span>}
                    </div>
                    <p className="text-sm text-ink-muted mt-2">{insights.burnout.reason}</p>
                </div>

                <div className="bg-elevated rounded-lg p-4 border border-indigo-500/15">
                    <h3 className="text-ink-muted text-sm font-semibold uppercase mb-2">Weakness Analysis</h3>
                    <ul className="space-y-1">
                        {insights.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm text-ink-secondary flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                {w}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
